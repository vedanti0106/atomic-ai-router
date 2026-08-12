/**
 * algorand.ts
 * Low-level Algorand client wrapper using algosdk v3.
 * Handles: algod connection, ATC composition, USDC ASA transfers,
 * escrow app call helpers (fund / release / refund / dispute / resolve).
 */

import algosdk from 'algosdk';

// ─── Config ──────────────────────────────────────────────────────────────────
const ALGOD_URL  = process.env.ALGOD_URL  ?? 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = process.env.ALGOD_PORT ?? '';
const ALGOD_TOKEN = process.env.ALGOD_TOKEN ?? '';

export const USDC_ASSET_ID = Number(process.env.USDC_ASSET_ID ?? '10458941'); // TestNet USDC ASA

// Router / admin mnemonic loaded from env — never hardcode in source
const ROUTER_MNEMONIC   = process.env.ROUTER_MNEMONIC   ?? '';
const FACILITATOR_MNEMONIC = process.env.FACILITATOR_MNEMONIC ?? '';

// ─── Client singleton ────────────────────────────────────────────────────────
let _algodClient: algosdk.Algodv2 | null = null;

export function getAlgodClient(): algosdk.Algodv2 {
  if (!_algodClient) {
    _algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_URL, ALGOD_PORT);
  }
  return _algodClient;
}

// ─── Account helpers ─────────────────────────────────────────────────────────
export function getRouterAccount(): algosdk.Account {
  if (!ROUTER_MNEMONIC) throw new Error('ROUTER_MNEMONIC env var not set');
  return algosdk.mnemonicToSecretKey(ROUTER_MNEMONIC);
}

export function getFacilitatorAccount(): algosdk.Account {
  if (!FACILITATOR_MNEMONIC) throw new Error('FACILITATOR_MNEMONIC env var not set');
  return algosdk.mnemonicToSecretKey(FACILITATOR_MNEMONIC);
}

// ─── Network status ──────────────────────────────────────────────────────────
export async function getCurrentRound(): Promise<number> {
  const status = await getAlgodClient().status().do();
  return Number(status['last-round']);
}

export async function getSuggestedParams(): Promise<algosdk.SuggestedParams> {
  return getAlgodClient().getTransactionParams().do();
}

// ─── ABI method descriptors (mirrors escrow_contract.py) ─────────────────────
export const ESCROW_ABI_METHODS = {
  fund_escrow: new algosdk.ABIMethod({
    name: 'fund_escrow',
    desc: 'Lock funds into escrow for a task',
    args: [
      { name: 'task_id',  type: 'string',  desc: 'Unique task identifier' },
      { name: 'agent',    type: 'address', desc: 'Agent Algorand address'  },
      { name: 'amount',   type: 'uint64',  desc: 'microUSDC to hold'      },
      { name: 'deadline', type: 'uint64',  desc: 'AVM round for auto-refund' },
      { name: 'payment',  type: 'axfer',   desc: 'USDC ASA transfer to app' },
    ],
    returns: { type: 'void' },
  }),

  release_escrow: new algosdk.ABIMethod({
    name: 'release_escrow',
    desc: 'Release held funds to agent after successful delivery',
    args: [
      { name: 'task_id',    type: 'string', desc: 'Task identifier'       },
      { name: 'proof_hash', type: 'byte[]', desc: 'SHA-256 of agent response' },
    ],
    returns: { type: 'void' },
  }),

  refund_escrow: new algosdk.ABIMethod({
    name: 'refund_escrow',
    desc: 'Return held funds to payer after deadline passes (permissionless)',
    args: [
      { name: 'task_id', type: 'string', desc: 'Task identifier' },
    ],
    returns: { type: 'void' },
  }),

  raise_dispute: new algosdk.ABIMethod({
    name: 'raise_dispute',
    desc: 'Freeze escrow funds, escalate to admin for manual resolution',
    args: [
      { name: 'task_id', type: 'string', desc: 'Task identifier' },
    ],
    returns: { type: 'void' },
  }),

  resolve_dispute: new algosdk.ABIMethod({
    name: 'resolve_dispute',
    desc: 'Admin resolves a dispute — release to agent or refund payer',
    args: [
      { name: 'task_id',          type: 'string', desc: 'Task identifier'          },
      { name: 'release_to_agent', type: 'bool',   desc: 'true=agent, false=refund' },
    ],
    returns: { type: 'void' },
  }),
} as const;

// ─── Core escrow call builders ────────────────────────────────────────────────

/**
 * Build and submit the fund_escrow ATC call.
 * Caller must have already opted the app into the USDC ASA.
 */
export async function fundEscrow(opts: {
  appId: number;
  taskId: string;
  agentAddress: string;
  amountMicroUsdc: bigint;
  deadlineRound: bigint;
  payerAccount: algosdk.Account;
}): Promise<{ txId: string; confirmedRound: number }> {
  const algod  = getAlgodClient();
  const sp     = await getSuggestedParams();
  const appAddr = algosdk.getApplicationAddress(opts.appId);

  // USDC ASA transfer to the app's escrow address
  const usdcTransfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender:    opts.payerAccount.addr,
    receiver:  appAddr,
    assetIndex: USDC_ASSET_ID,
    amount:    opts.amountMicroUsdc,
    suggestedParams: { ...sp, fee: 1000n, flatFee: true },
  });

  const atc = new algosdk.AtomicTransactionComposer();
  atc.addMethodCall({
    appID: opts.appId,
    method: ESCROW_ABI_METHODS.fund_escrow,
    methodArgs: [
      opts.taskId,
      opts.agentAddress,
      opts.amountMicroUsdc,
      opts.deadlineRound,
      { txn: usdcTransfer, signer: algosdk.makeBasicAccountTransactionSigner(opts.payerAccount) },
    ],
    signer: algosdk.makeBasicAccountTransactionSigner(opts.payerAccount),
    sender: opts.payerAccount.addr,
    suggestedParams: { ...sp, fee: 2000n, flatFee: true },
    boxes: [{ appIndex: opts.appId, name: new TextEncoder().encode(opts.taskId) }],
  });

  const result = await atc.execute(algod, 4);
  const txId   = result.txIDs[result.txIDs.length - 1];
  const info   = await algod.pendingTransactionInformation(txId).do();
  return { txId, confirmedRound: Number(info['confirmed-round'] ?? 0) };
}

/**
 * Build and submit the release_escrow ATC call.
 * Only the facilitator account may call this.
 */
export async function releaseEscrow(opts: {
  appId: number;
  taskId: string;
  proofHash: Uint8Array;
  facilitatorAccount: algosdk.Account;
  agentAddress: string;   // needed as account reference in the txn
}): Promise<{ txId: string; confirmedRound: number }> {
  const algod = getAlgodClient();
  const sp    = await getSuggestedParams();

  const atc = new algosdk.AtomicTransactionComposer();
  atc.addMethodCall({
    appID: opts.appId,
    method: ESCROW_ABI_METHODS.release_escrow,
    methodArgs: [opts.taskId, opts.proofHash],
    signer: algosdk.makeBasicAccountTransactionSigner(opts.facilitatorAccount),
    sender: opts.facilitatorAccount.addr,
    suggestedParams: { ...sp, fee: 2000n, flatFee: true },
    accounts: [opts.agentAddress],
    boxes: [{ appIndex: opts.appId, name: new TextEncoder().encode(opts.taskId) }],
    foreignAssets: [USDC_ASSET_ID],
  });

  const result = await atc.execute(algod, 4);
  const txId   = result.txIDs[result.txIDs.length - 1];
  const info   = await algod.pendingTransactionInformation(txId).do();
  return { txId, confirmedRound: Number(info['confirmed-round'] ?? 0) };
}

/**
 * Permissionless refund — callable by anyone once deadline round has passed.
 */
export async function refundEscrow(opts: {
  appId: number;
  taskId: string;
  callerAccount: algosdk.Account;
  payerAddress: string;  // account reference
}): Promise<{ txId: string; confirmedRound: number }> {
  const algod = getAlgodClient();
  const sp    = await getSuggestedParams();

  const atc = new algosdk.AtomicTransactionComposer();
  atc.addMethodCall({
    appID: opts.appId,
    method: ESCROW_ABI_METHODS.refund_escrow,
    methodArgs: [opts.taskId],
    signer: algosdk.makeBasicAccountTransactionSigner(opts.callerAccount),
    sender: opts.callerAccount.addr,
    suggestedParams: { ...sp, fee: 2000n, flatFee: true },
    accounts: [opts.payerAddress],
    boxes: [{ appIndex: opts.appId, name: new TextEncoder().encode(opts.taskId) }],
    foreignAssets: [USDC_ASSET_ID],
  });

  const result = await atc.execute(algod, 4);
  const txId   = result.txIDs[result.txIDs.length - 1];
  const info   = await algod.pendingTransactionInformation(txId).do();
  return { txId, confirmedRound: Number(info['confirmed-round'] ?? 0) };
}

/**
 * Payer raises a dispute — freezes escrow until admin resolves.
 */
export async function raiseDispute(opts: {
  appId: number;
  taskId: string;
  payerAccount: algosdk.Account;
}): Promise<{ txId: string }> {
  const algod = getAlgodClient();
  const sp    = await getSuggestedParams();

  const atc = new algosdk.AtomicTransactionComposer();
  atc.addMethodCall({
    appID: opts.appId,
    method: ESCROW_ABI_METHODS.raise_dispute,
    methodArgs: [opts.taskId],
    signer: algosdk.makeBasicAccountTransactionSigner(opts.payerAccount),
    sender: opts.payerAccount.addr,
    suggestedParams: { ...sp, fee: 1000n, flatFee: true },
    boxes: [{ appIndex: opts.appId, name: new TextEncoder().encode(opts.taskId) }],
  });

  const result = await atc.execute(algod, 4);
  return { txId: result.txIDs[result.txIDs.length - 1] };
}

/**
 * Admin resolves a dispute — releases to agent or refunds payer.
 */
export async function resolveDispute(opts: {
  appId: number;
  taskId: string;
  releaseToAgent: boolean;
  adminAccount: algosdk.Account;
  agentAddress: string;
  payerAddress: string;
}): Promise<{ txId: string; confirmedRound: number }> {
  const algod = getAlgodClient();
  const sp    = await getSuggestedParams();

  const atc = new algosdk.AtomicTransactionComposer();
  atc.addMethodCall({
    appID: opts.appId,
    method: ESCROW_ABI_METHODS.resolve_dispute,
    methodArgs: [opts.taskId, opts.releaseToAgent],
    signer: algosdk.makeBasicAccountTransactionSigner(opts.adminAccount),
    sender: opts.adminAccount.addr,
    suggestedParams: { ...sp, fee: 2000n, flatFee: true },
    accounts: [opts.agentAddress, opts.payerAddress],
    boxes: [{ appIndex: opts.appId, name: new TextEncoder().encode(opts.taskId) }],
    foreignAssets: [USDC_ASSET_ID],
  });

  const result = await atc.execute(algod, 4);
  const txId   = result.txIDs[result.txIDs.length - 1];
  const info   = await algod.pendingTransactionInformation(txId).do();
  return { txId, confirmedRound: Number(info['confirmed-round'] ?? 0) };
}

// ─── Box storage reader ───────────────────────────────────────────────────────
/**
 * Read a task's escrow box directly from the chain to get live status.
 * Returns the raw bytes — decode with decodeEscrowBox().
 */
export async function readEscrowBox(appId: number, taskId: string): Promise<Uint8Array | null> {
  try {
    const algod   = getAlgodClient();
    const boxName = new TextEncoder().encode(taskId);
    const result  = await algod.getApplicationBoxByName(appId, boxName).do();
    return result.value as Uint8Array;
  } catch {
    return null;
  }
}

// ─── Utility: SHA-256 proof hash ─────────────────────────────────────────────
import { createHash } from 'crypto';

export function hashProof(responsePayload: string): Uint8Array {
  return new Uint8Array(createHash('sha256').update(responsePayload, 'utf8').digest());
}

// ─── Utility: microUSDC <-> USDC conversion ──────────────────────────────────
export function toMicroUsdc(usdc: number): bigint {
  return BigInt(Math.round(usdc * 1_000_000));
}

export function fromMicroUsdc(micro: bigint): number {
  return Number(micro) / 1_000_000;
}
