import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ==========================================
// 1. USERS TABLE
// ==========================================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  balance: real('balance').notNull().default(100.0), // Off-chain ledger balance in USDC
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ==========================================
// 2. AGENTS TABLE
// ==========================================
export const agents = sqliteTable('agents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  endpointUrl: text('endpoint_url').notNull(),
  pricePerCall: real('price_per_call').notNull(), // Cost in USDC per API call
  walletAddress: text('wallet_address').notNull(), // Algorand address agent receives payments to
  reputationScore: real('reputation_score').notNull().default(100.0),
  status: text('status').notNull().default('ACTIVE'), // ACTIVE, OFFLINE, DISABLED
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ==========================================
// 3. TASKS TABLE
// ==========================================
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  goal: text('goal').notNull(),
  status: text('status').notNull().default('IN_PROGRESS'), // IN_PROGRESS, SUCCESS, FAILED, ROLLED_BACK
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

// ==========================================
// 4. TRANSACTIONS TABLE
// ==========================================
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id),
  agentId: text('agent_id').notNull().references(() => agents.id),
  status: text('status').notNull().default('PENDING'), // PENDING, PAID, FAILED, REFUNDED
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ==========================================
// 5. PAYMENTS TABLE
// ==========================================
export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().references(() => transactions.id),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().default('USDC'),
  nonce: text('nonce').notNull().unique(), // Cryptographic unique nonce to prevent replay attacks
  // Note: algorandTxId tracks ONLY the escrow-funding transaction (money entering contract).
  algorandTxId: text('algorand_tx_id'),
  settledAt: integer('settled_at', { mode: 'timestamp' }),
});

// ==========================================
// 6. ESCROWS TABLE
// ==========================================
export const escrows = sqliteTable('escrows', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id),
  appId: text('app_id').notNull(), // Algorand app ID of the deployed escrow smart contract
  boxKey: text('box_key').notNull(), // task_id string used as box key on-chain
  payerAddress: text('payer_address').notNull(),
  agentAddress: text('agent_address').notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull().default('FUNDED'), // FUNDED, RELEASED, REFUNDED, DISPUTED
  deadlineRound: integer('deadline_round').notNull(),
  txidFund: text('txid_fund').notNull(),
  // Note: txidResolution owns the full resolution lifecycle (tracks release or refund txid).
  txidResolution: text('txid_resolution'),
  proofHash: text('proof_hash'), // Nullable until released
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ==========================================
// 7. REPUTATION CACHE TABLE
// ==========================================
// Note: This table is strictly a local mirror/cache to optimize agent routing decisions.
// The absolute cryptographic source of truth is always the on-chain box value returned via get_score().
export const reputationCache = sqliteTable('reputation_cache', {
  agentAddress: text('agent_address').primaryKey(),
  totalCalls: integer('total_calls').notNull().default(0),
  successfulCalls: integer('successful_calls').notNull().default(0),
  disputedCalls: integer('disputed_calls').notNull().default(0),
  score: real('score').notNull().default(100.0), // Derived cache score
  lastSyncedRound: integer('last_synced_round'),
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ==========================================
// 8. LOGS TABLE
// ==========================================
export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  taskId: text('task_id').references(() => tasks.id),
  level: text('level').notNull(), // INFO, WARN, ERROR
  message: text('message').notNull(),
  metadata: text('metadata'), // JSON-stringified details
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
