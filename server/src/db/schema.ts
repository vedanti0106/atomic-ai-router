import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ─── Agents ──────────────────────────────────────────────────────────────────
export const agents = sqliteTable('agents', {
  id: text('id').primaryKey(),                     // e.g. "agent_flight_ai"
  name: text('name').notNull(),
  icon: text('icon').notNull().default('🤖'),
  description: text('description').notNull().default(''),
  endpoint: text('endpoint').notNull(),            // http://localhost:3001/search
  walletAddress: text('wallet_address').notNull(), // Algorand pubkey
  status: text('status').notNull().default('ONLINE'), // ONLINE | BUSY | OFFLINE
  latencyMs: integer('latency_ms').notNull().default(0),
  successRate: real('success_rate').notNull().default(100.0),
  priceUsdc: real('price_usdc').notNull().default(1.0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),                     // e.g. "task_9f31ab"
  goal: text('goal').notNull(),
  userId: text('user_id').notNull(),
  status: text('status').notNull().default('IN_PROGRESS'),
  // SUCCESS | IN_PROGRESS | FAILED | ROLLED_BACK
  totalCostUsdc: real('total_cost_usdc').notNull().default(0),
  executionTimeMs: integer('execution_time_ms'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

// ─── Task–Agent join (execution steps) ───────────────────────────────────────
export const taskAgents = sqliteTable('task_agents', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id),
  agentId: text('agent_id').notNull().references(() => agents.id),
  status: text('status').notNull().default('PENDING'),
  // PENDING | RUNNING | COMPLETED | FAILED | ROLLED_BACK
  priceUsdc: real('price_usdc').notNull().default(0),
  txId: text('tx_id'),                             // Algorand TxID once settled
  latencyMs: integer('latency_ms'),
  nonce: text('nonce'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});

// ─── x402 Payment Transactions ───────────────────────────────────────────────
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),                     // e.g. "TX_ALG_99201A843F"
  taskId: text('task_id').notNull().references(() => tasks.id),
  agentId: text('agent_id').notNull().references(() => agents.id),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().default('USDC'),
  nonce: text('nonce').notNull(),
  status: text('status').notNull().default('PENDING'),
  // SETTLED | PENDING | REFUNDED | CHALLENGED
  algorandTxId: text('algorand_tx_id'),
  confirmedRound: integer('confirmed_round'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});

// ─── Escrows (one per task, Box Storage backed on-chain) ─────────────────────
export const escrows = sqliteTable('escrows', {
  id: text('id').primaryKey(),                     // e.g. "escrow_task_9f31ab"
  taskId: text('task_id').notNull().references(() => tasks.id),

  // On-chain identifiers
  appId: integer('app_id'),                        // Algorand application ID
  boxKey: text('box_key').notNull(),               // task_id used as box key
  escrowAddress: text('escrow_address'),           // app's escrow account address

  // Parties
  payerAddress: text('payer_address').notNull(),   // Router / client wallet
  agentAddress: text('agent_address').notNull(),   // Receiving agent wallet

  // Financials
  amountUsdc: real('amount_usdc').notNull(),       // microUSDC held
  usdcAssetId: integer('usdc_asset_id').notNull().default(10458941),

  // State machine
  status: text('status').notNull().default('FUNDED'),
  // FUNDED | RELEASED | REFUNDED | DISPUTED

  // Timing
  deadlineRound: integer('deadline_round').notNull(), // AVM round after which refund is open
  fundedRound: integer('funded_round'),
  resolvedRound: integer('resolved_round'),

  // Proof
  proofHash: text('proof_hash'),                  // SHA-256 of agent's response payload

  // Transaction IDs
  txidFund: text('txid_fund'),
  txidRelease: text('txid_release'),
  txidRefund: text('txid_refund'),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});

// ─── Logs ─────────────────────────────────────────────────────────────────────
export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  taskId: text('task_id'),
  level: text('level').notNull().default('INFO'),
  // INFO | WARN | ERROR | x402 | ESCROW
  source: text('source').notNull(),
  message: text('message').notNull(),
  metadata: text('metadata'),                      // JSON string
  timestamp: integer('timestamp', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});

// ─── Nonces (replay-attack prevention) ───────────────────────────────────────
export const nonces = sqliteTable('nonces', {
  nonce: text('nonce').primaryKey(),
  taskId: text('task_id'),
  agentId: text('agent_id'),
  usedAt: integer('used_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type TaskAgent = typeof taskAgents.$inferSelect;
export type NewTaskAgent = typeof taskAgents.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Escrow = typeof escrows.$inferSelect;
export type NewEscrow = typeof escrows.$inferInsert;
export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
