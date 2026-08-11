/**
 * index.ts — Atomic AI Router — Hono HTTP Server
 *
 * Routes:
 *   GET  /health
 *   GET  /api/escrow/:taskId        — escrow status + live countdown
 *   POST /api/escrow/fund           — lock funds in escrow
 *   POST /api/escrow/release        — facilitator releases funds after proof
 *   POST /api/escrow/refund         — permissionless auto-refund after deadline
 *   POST /api/escrow/dispute        — payer raises a dispute
 *   POST /api/escrow/resolve        — admin resolves a dispute
 *   GET  /api/escrow/expired        — list all FUNDED escrows past deadline (for watcher)
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import {
  fundEscrow,
  releaseEscrow,
  refundEscrow,
  raiseDispute,
  resolveDispute,
  getEscrowStatus,
  getExpiredEscrows,
} from './lib/escrow.js';
import { getCurrentRound } from './lib/algorand.js';

const app = new Hono();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'OPTIONS'] }));
app.use('*', logger());

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/health', async (c) => {
  let algoRound = 0;
  try { algoRound = await getCurrentRound(); } catch { /* offline */ }
  return c.json({
    status: 'ok',
    service: 'atomic-ai-router-server',
    algorandTestNet: algoRound > 0 ? 'reachable' : 'unreachable',
    currentRound: algoRound,
    timestamp: new Date().toISOString(),
  });
});

// ─── POST /api/escrow/fund ────────────────────────────────────────────────────
app.post('/api/escrow/fund', async (c) => {
  try {
    const body = await c.req.json<{
      taskId: string;
      agentAddress: string;
      amountUsdc: number;
      deadlineRounds?: number;
    }>();

    if (!body.taskId || !body.agentAddress || !body.amountUsdc) {
      return c.json({ error: 'taskId, agentAddress, and amountUsdc are required' }, 400);
    }

    const result = await fundEscrow({
      taskId: body.taskId,
      agentAddress: body.agentAddress,
      amountUsdc: body.amountUsdc,
      deadlineRounds: body.deadlineRounds,
    });

    return c.json({ success: true, ...result }, 201);
  } catch (err: any) {
    console.error('[POST /api/escrow/fund]', err);
    return c.json({ error: err.message ?? 'Internal error' }, 500);
  }
});

// ─── POST /api/escrow/release ─────────────────────────────────────────────────
app.post('/api/escrow/release', async (c) => {
  try {
    const body = await c.req.json<{
      taskId: string;
      responsePayload: string;  // raw agent response to hash as proof
    }>();

    if (!body.taskId || !body.responsePayload) {
      return c.json({ error: 'taskId and responsePayload are required' }, 400);
    }

    const result = await releaseEscrow({
      taskId: body.taskId,
      responsePayload: body.responsePayload,
    });

    return c.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[POST /api/escrow/release]', err);
    return c.json({ error: err.message ?? 'Internal error' }, 500);
  }
});

// ─── POST /api/escrow/refund ──────────────────────────────────────────────────
app.post('/api/escrow/refund', async (c) => {
  try {
    const body = await c.req.json<{ taskId: string }>();
    if (!body.taskId) return c.json({ error: 'taskId is required' }, 400);

    const result = await refundEscrow({ taskId: body.taskId });
    return c.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[POST /api/escrow/refund]', err);
    // Surface deadline-not-passed errors as 409 Conflict, not 500
    const status = err.message?.includes('Deadline not yet passed') ? 409 : 500;
    return c.json({ error: err.message ?? 'Internal error' }, status);
  }
});

// ─── POST /api/escrow/dispute ─────────────────────────────────────────────────
app.post('/api/escrow/dispute', async (c) => {
  try {
    const body = await c.req.json<{ taskId: string }>();
    if (!body.taskId) return c.json({ error: 'taskId is required' }, 400);

    const result = await raiseDispute({ taskId: body.taskId });
    return c.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[POST /api/escrow/dispute]', err);
    return c.json({ error: err.message ?? 'Internal error' }, 500);
  }
});

// ─── POST /api/escrow/resolve ─────────────────────────────────────────────────
app.post('/api/escrow/resolve', async (c) => {
  try {
    const body = await c.req.json<{
      taskId: string;
      releaseToAgent: boolean;
    }>();

    if (!body.taskId || body.releaseToAgent === undefined) {
      return c.json({ error: 'taskId and releaseToAgent (bool) are required' }, 400);
    }

    const result = await resolveDispute({
      taskId: body.taskId,
      releaseToAgent: body.releaseToAgent,
    });

    return c.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[POST /api/escrow/resolve]', err);
    return c.json({ error: err.message ?? 'Internal error' }, 500);
  }
});

// ─── GET /api/escrow/expired ──────────────────────────────────────────────────
app.get('/api/escrow/expired', async (c) => {
  try {
    const expired = await getExpiredEscrows();
    return c.json({ success: true, count: expired.length, escrows: expired });
  } catch (err: any) {
    console.error('[GET /api/escrow/expired]', err);
    return c.json({ error: err.message ?? 'Internal error' }, 500);
  }
});

// ─── GET /api/escrow/:taskId ──────────────────────────────────────────────────
app.get('/api/escrow/:taskId', async (c) => {
  try {
    const { taskId } = c.req.param();
    const status = await getEscrowStatus(taskId);
    if (!status) return c.json({ error: `No escrow found for task ${taskId}` }, 404);
    return c.json({ success: true, escrow: status });
  } catch (err: any) {
    console.error('[GET /api/escrow/:taskId]', err);
    return c.json({ error: err.message ?? 'Internal error' }, 500);
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 3001);

export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`🚀 Atomic AI Router server running on http://localhost:${PORT}`);
console.log(`   Algorand Network : ${process.env.ALGOD_URL ?? 'https://testnet-api.algonode.cloud'}`);
console.log(`   Escrow App ID    : ${process.env.ESCROW_APP_ID ?? '(not set — deploy contract first)'}`);
