import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store database file at the root level of the workspace
const dbPath = path.resolve(__dirname, '../../../sqlite.db');

const sqlite = new Database(dbPath);

// Enable WAL mode for SQLite to improve concurrency (crucial for local testing)
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
export type DbClient = typeof db;
export * as schema from './schema.js';
