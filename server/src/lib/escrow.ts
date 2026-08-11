/**
 * escrow.ts
 * High-level escrow service layer.
 * Bridges the Drizzle DB (escrows table) ↔ Algorand on-chain calls.
 *
 * All monetary values stored in DB are in full USDC (float).
 * All Algorand calls use microUSDC (bigint) internally.
 */

import { eq } from 'drizzle-orm';
import { getDb } from '../db/client.js';
import { escrows, tasks, logs, type NewEscrow } from '../db/schema.js';
import {
  getRouterAccount,
  getFacilitatorAccount,
  getCurrentRound,
  fundEscrow as algoFundEscrow,
  releaseEscrow as algoReleaseEscrow,
  refundEscrow as algoRefundEscrow,
  raiseDispute as algoRaiseDispute,
  resolveDispute as algoResolveDispute,
  hashProof,
  toMicroUsdc,
  USDC_ASSET_ID,
} from './algorand.js';

// ─── Config ──────────────────────────────────────────────────────────────────
/** Default number of Algorand rounds before auto-refund becomes available (~25 min on TestNet) */
const DEFAULT_DEADLINE_ROUNDS = Number(process.env.ESCROW_DEADLINE_ROUNDS ?? '300');

/** Single reusable escrow app ID — deployed once, handles all tasks via Box Storage */
const ESCROW_APP_ID = Number(process.env.ESCROW_APP_ID ?? '0');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function escrowId(taskId: string) {
  return `escrow_${taskId}`;
}

async function appendLog(opts: {
  taskId?: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'x402' | 'ESCROW';
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
}) {
  const db = getDb();
  await db.insert(logs).values({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    taskId: opts.taskId,
    level: opts.level,
    source: opts.source,
    message: opts.message,
    metadata: opts.metadata ? JSON.stringify(opts.metadata) : undefined,
  });
}

// ─── Fund ─────────────────────────────────────────────────────────────────────
/**
 * Lock client funds in the escrow contract for a given task.
 * Called right after the Router receives a 402 challenge from an agent.
 */
export async function fundEscrow(opts: {
  taskId: string;
  agentAddress: string;
  amountUsdc: number;
  deadlineRounds?: number;
}): Promise<{ escrowId: string; txId: string; deadlineRound: number }> {
  if (ESCROW_APP_ID === 0) throw new Error('ESCROW_APP_ID env var not configured');

  const db            = getDb();
  const payerAccount  = getRouterAccount();
  const currentRound  = await getCurrentRound();
  const deadline      = currentRound + (opts.deadlineRounds ?? DEFAULT_DEADLINE_ROUNDS);
  const microAmount   = toMicroUsdc(opts.amountUsdc);

  await appendLog({
    taskId: opts.taskId,
    level: 'ESCROW',
    source: 'EscrowService',
    message: `Funding escrow for task ${opts.taskId} — ${opts.amountUsdc} USDC → agent ${opts.agentAddress}`,
    metadata: { amountUsdc: opts.amountUsdc, deadline, appId: ESCROW_APP_ID },
  });

  const { txId, confirmedRound } = await algoFundEscrow({
    appId: ESCROW_APP_ID,
    taskId: opts.taskId,
    agentAddress: opts.agentAddress,
    amountMicroUsdc: microAmount,
    deadlineRound: BigInt(deadline),
    payerAccount,
  });

  const newEscrow: NewEscrow = {
    id: escrowId(opts.taskId),
    taskId: opts.taskId,
    appId: ESCROW_APP_ID,
    boxKey: opts.taskId,
    escrowAddress: undefined,
    payerAddress: payerAccount.addr.toString(),
    agentAddress: opts.agentAddress,
    amountUsdc: opts.amountUsdc,
    usdcAssetId: USDC_ASSET_ID,
    status: 'FUNDED',
    deadlineRound: deadline,
    fundedRound: confirmedRound,
    txidFund: txId,
  };

  await db.insert(escrows).values(newEscrow).onConflictDoUpdate({
    target: escrows.id,
    set: { status: 'FUNDED', txidFund: txId, fundedRound: confirmedRound, deadlineRound: deadline },
  });

  await appendLog({
    taskId: opts.taskId,
    level: 'ESCROW',
    source: 'EscrowService',
    message: `Escrow FUNDED — TxID ${txId}, deadline round ${deadline}`,
    metadata: { txId, confirmedRound, deadline },
  });

  return { escrowId: escrowId(opts.taskId), txId, deadlineRound: deadline };
}

// ─── Release ──────────────────────────────────────────────────────────────────
/**
 * Facilitator confirms delivery proof and releases funds to agent.
 * Called after the Router validates the agent's response.
 */
export async function releaseEscrow(opts: {
  taskId: string;
  responsePayload: string;  // Raw agent response — will be hashed
}): Promise<{ txId: string; proofHash: string }> {
  const db = getDb();

  const escrow = await db.query.escrows.findFirst({
    where: eq(escrows.taskId, opts.taskId),
  });
  if (!escrow) throw new Error(`No escrow found for task ${opts.taskId}`);
  if (escrow.status !== 'FUNDED') {
    throw new Error(`Escrow ${escrow.id} is in status ${escrow.status}, cannot release`);
  }

  const facilitator = getFacilitatorAccount();
  const proof       = hashProof(opts.responsePayload);
  const proofHex    = Buffer.from(proof).toString('hex');

  await appendLog({
    taskId: opts.taskId,
    level: 'ESCROW',
    source: 'EscrowService',
    message: `Releasing escrow for task ${opts.taskId} — proof hash ${proofHex.slice(0, 16)}…`,
    metadata: { proofHash: proofHex, agentAddress: escrow.agentAddress },
  });

  const { txId, confirmedRound } = await algoReleaseEscrow({
    appId: escrow.appId!,
    taskId: opts.taskId,
    proofHash: proof,
    facilitatorAccount: facilitator,
    agentAddress: escrow.agentAddress,
  });

  await db.update(escrows)
    .set({ status: 'RELEASED', proofHash: proofHex, txidRelease: txId, resolvedRound: confirmedRound, updatedAt: new Date() })
    .where(eq(escrows.taskId, opts.taskId));

  // Mark the parent task as SUCCESS
  await db.update(tasks)
    .set({ status: 'SUCCESS', completedAt: new Date() })
    .where(eq(tasks.id, opts.taskId));

  await appendLog({
    taskId: opts.taskId,
    level: 'ESCROW',
    source: 'EscrowService',
    message: `Escrow RELEASED — ${escrow.amountUsdc} USDC sent to agent. TxID ${txId}`,
    metadata: { txId, confirmedRound, agentAddress: escrow.agentAddress, amountUsdc: escrow.amountUsdc },
  });

  return { txId, proofHash: proofHex };
}

// ─── Refund (permissionless timeout) ─────────────────────────────────────────
/**
 * Trigger auto-refund after deadline round passes.
 * Permissionless — can be called by any watcher, cron, or the frontend.
 */
export async function refundEscrow(opts: {
  taskId: string;
}): Promise<{ txId: string }> {
  const db = getDb();

  const escrow = await db.query.escrows.findFirst({
    where: eq(escrows.taskId, opts.taskId),
  });
  if (!escrow) throw new Error(`No escrow found for task ${opts.taskId}`);
  if (escrow.status !== 'FUNDED') {
    throw new Error(`Escrow ${escrow.id} is in status ${escrow.status}, cannot refund`);
  }

  const currentRound = await getCurrentRound();
  if (currentRound <= escrow.deadlineRound) {
    throw new Error(
      `Deadline not yet passed. Current: ${currentRound}, deadline: ${escrow.deadlineRound}. ` +
      `~${escrow.deadlineRound - currentRound} rounds remaining.`
    );
  }

  const caller = getRouterAccount(); // any account works — contract is permissionless

  await appendLog({
    taskId: opts.taskId,
    level: 'ESCROW',
    source: 'EscrowService',
    message: `Triggering auto-refund for task ${opts.taskId} — deadline ${escrow.deadlineRound} passed at round ${currentRound}`,
    metadata: { currentRound, deadlineRound: escrow.deadlineRound },
  });

  const { txId, confirmedRound } = await algoRefundEscrow({
    appId: escrow.appId!,
    taskId: opts.taskId,
    callerAccount: caller,
    payerAddress: escrow.payerAddress,
  });

  await db.update(escrows)
    .set({ status: 'REFUNDED', txidRefund: txId, resolvedRound: confirmedRound, updatedAt: new Date() })
    .where(eq(escrows.taskId, opts.taskId));

  // Mark the parent task as ROLLED_BACK
  await db.update(tasks)
    .set({ status: 'ROLLED_BACK', completedAt: new Date() })
    .where(eq(tasks.id, opts.taskId));

  await appendLog({
    taskId: opts.taskId,
    level: 'ESCROW',
    source: 'EscrowService',
    message: `Escrow REFUNDED — ${escrow.amountUsdc} USDC returned to payer. TxID ${txId}`,
    metadata: { txId, confirmedRound, payerAddress: escrow.payerAddress, amountUsdc: escrow.amountUsdc },
  });

  return { txId };
}

// ─── Raise Dispute ────────────────────────────────────────────────────────────
/**
 * Payer raises a dispute — freezes escrow until admin resolves.
 */
export async function raiseDispute(opts: {
  taskId: string;
}): Promise<{ txId: string }> {
  const db = getDb();

  const escrow = await db.query.escrows.findFirst({
    where: eq(escrows.taskId, opts.taskId),
  });
  if (!escrow) throw new Error(`No escrow found for task ${opts.taskId}`);
  if (escrow.status !== 'FUNDED') {
    throw new Error(`Escrow ${escrow.id} is in status ${escrow.status}, cannot dispute`);
  }

  const payer = getRouterAccount();

  const { txId } = await algoRaiseDispute({
    appId: escrow.appId!,
    taskId: opts.taskId,
    payerAccount: payer,
  });

  await db.update(escrows)
    .set({ status: 'DISPUTED', updatedAt: new Date() })
    .where(eq(escrows.taskId, opts.taskId));

  await db.update(tasks)
    .set({ status: 'DISPUTED' as any })
    .where(eq(tasks.id, opts.taskId));

  await appendLog({
    taskId: opts.taskId,
    level: 'ESCROW',
    source: 'EscrowService',
    message: `Dispute RAISED for task ${opts.taskId} — funds frozen pending admin resolution`,
    metadata: { txId, escrowId: escrow.id },
  });

  return { txId };
}

// ─── Resolve Dispute ─────────────────────────────────────────────────────────
/**
 * Admin resolves a dispute. Only callable by the router admin address.
 */
export async function resolveDispute(opts: {
  taskId: string;
  releaseToAgent: boolean;
}): Promise<{ txId: string }> {
  const db = getDb();

  const escrow = await db.query.escrows.findFirst({
    where: eq(escrows.taskId, opts.taskId),
  });
  if (!escrow) throw new Error(`No escrow found for task ${opts.taskId}`);
  if (escrow.status !== 'DISPUTED') {
    throw new Error(`Escrow ${escrow.id} is not in DISPUTED status`);
  }

  const admin = getRouterAccount(); // admin is the router operator for hackathon

  const { txId, confirmedRound } = await algoResolveDispute({
    appId: escrow.appId!,
    taskId: opts.taskId,
    releaseToAgent: opts.releaseToAgent,
    adminAccount: admin,
    agentAddress: escrow.agentAddress,
    payerAddress: escrow.payerAddress,
  });

  const finalStatus = opts.releaseToAgent ? 'RELEASED' : 'REFUNDED';
  const setField = opts.releaseToAgent ? { txidRelease: txId } : { txidRefund: txId };

  await db.update(escrows)
    .set({ status: finalStatus, ...setField, resolvedRound: confirmedRound, updatedAt: new Date() })
    .where(eq(escrows.taskId, opts.taskId));

  await db.update(tasks)
    .set({ status: opts.releaseToAgent ? 'SUCCESS' : 'ROLLED_BACK', completedAt: new Date() })
    .where(eq(tasks.id, opts.taskId));

  await appendLog({
    taskId: opts.taskId,
    level: 'ESCROW',
    source: 'Admin',
    message: `Dispute RESOLVED for task ${opts.taskId} — funds ${opts.releaseToAgent ? 'released to agent' : 'refunded to payer'}`,
    metadata: { txId, confirmedRound, releaseToAgent: opts.releaseToAgent },
  });

  return { txId };
}

// ─── Status query ─────────────────────────────────────────────────────────────
/**
 * Get escrow record + live rounds-remaining from the chain.
 */
export async function getEscrowStatus(taskId: string) {
  const db     = getDb();
  const escrow = await db.query.escrows.findFirst({
    where: eq(escrows.taskId, taskId),
  });
  if (!escrow) return null;

  const currentRound   = await getCurrentRound().catch(() => 0);
  const roundsLeft     = Math.max(0, escrow.deadlineRound - currentRound);
  const secondsLeft    = roundsLeft * 4; // ~4s per round on Algorand TestNet
  const canRefundNow   = escrow.status === 'FUNDED' && currentRound > escrow.deadlineRound;

  return { ...escrow, currentRound, roundsLeft, secondsLeft, canRefundNow };
}

// ─── Bulk status (for watcher / cron) ────────────────────────────────────────
/**
 * Returns all FUNDED escrows that have passed their deadline — ready for auto-refund.
 */
export async function getExpiredEscrows() {
  const db           = getDb();
  const currentRound = await getCurrentRound();

  const all = await db.query.escrows.findMany({
    where: eq(escrows.status, 'FUNDED'),
  });

  return all.filter(e => currentRound > e.deadlineRound);
}
