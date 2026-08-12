import { db } from './index.js';
import { agents, users, tasks, escrows, logs, transactions, payments, reputationCache } from './schema.js';

async function reset() {
  // Safe check for --force flag
  if (!process.argv.includes('--force')) {
    console.error("Error: Database reset must be run with the '--force' flag to confirm.");
    process.exit(1);
  }

  console.log('[SQLite DB Reset] Initiating database purge...');

  try {
    // Delete all records in order of dependency
    await db.delete(payments);
    await db.delete(transactions);
    await db.delete(escrows);
    await db.delete(logs);
    await db.delete(reputationCache);
    await db.delete(tasks);
    await db.delete(users);
    await db.delete(agents);

    console.log('[SQLite DB Reset] Database successfully purged.');
    console.log('[SQLite DB Reset] Seeding default AI Agents...');

    // Seed default AI agents
    await db.insert(agents).values([
      {
        id: 'flight-agent',
        name: 'Flight AI',
        endpointUrl: 'http://localhost:3003/flight',
        pricePerCall: 3.00,
        walletAddress: 'ALGO_FLIGHT_W4812A4789X012',
        reputationScore: 99.8,
        status: 'ACTIVE'
      },
      {
        id: 'hotel-agent',
        name: 'Hotel AI',
        endpointUrl: 'http://localhost:3004/hotel',
        pricePerCall: 2.50,
        walletAddress: 'ALGO_HOTEL_W1023B4789X013',
        reputationScore: 99.9,
        status: 'ACTIVE'
      },
      {
        id: 'weather-agent',
        name: 'Weather AI',
        endpointUrl: 'http://localhost:3005/weather',
        pricePerCall: 0.50,
        walletAddress: 'ALGO_WEATH_W9312C4789X014',
        reputationScore: 100.0,
        status: 'ACTIVE'
      },
      {
        id: 'finance-agent',
        name: 'Finance AI',
        endpointUrl: 'http://localhost:3006/finance',
        pricePerCall: 4.00,
        walletAddress: 'ALGO_FINAN_W2212D4789X015',
        reputationScore: 99.5,
        status: 'ACTIVE'
      },
      {
        id: 'maps-agent',
        name: 'Maps AI',
        endpointUrl: 'http://localhost:3007/maps',
        pricePerCall: 1.00,
        walletAddress: 'ALGO_MAPS_W7712E4789X016',
        reputationScore: 99.9,
        status: 'ACTIVE'
      }
    ]);

    console.log('[SQLite DB Reset] Database successfully reset and seeded!');
    process.exit(0);
  } catch (error) {
    console.error('[SQLite DB Reset] Error resetting database:', error);
    process.exit(1);
  }
}

reset();
