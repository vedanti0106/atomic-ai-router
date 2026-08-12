import { db } from '../db/index.js';
import { reputationCache } from '../db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Syncs the local reputation cache for a specific agent.
 * In production, this would query the Algorand blockchain box state (via algod.getApplicationBox)
 * to retrieve the absolute source-of-truth score.
 * 
 * For the hackathon demo, we accept the update events directly to simulate the post-settlement sync.
 */
export async function syncReputation(
  agentAddress: string, 
  outcome: 'SUCCESS' | 'DISPUTE', 
  latestRound: number = 1000
) {
  try {
    const existing = await db.query.reputationCache.findFirst({
      where: eq(reputationCache.agentAddress, agentAddress)
    });

    const currentTotal = (existing?.totalCalls ?? 0) + 1;
    let currentSuccess = existing?.successfulCalls ?? 0;
    let currentDispute = existing?.disputedCalls ?? 0;

    if (outcome === 'SUCCESS') {
      currentSuccess += 1;
    } else {
      currentDispute += 1;
    }

    // Reputation Score formula: Percentage of successful calls out of total calls
    const derivedScore = currentTotal > 0 ? (currentSuccess / currentTotal) * 100 : 100.0;

    await db.insert(reputationCache)
      .values({
        agentAddress,
        totalCalls: currentTotal,
        successfulCalls: currentSuccess,
        disputedCalls: currentDispute,
        score: derivedScore,
        lastSyncedRound: latestRound,
        lastSyncedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: reputationCache.agentAddress,
        set: {
          totalCalls: currentTotal,
          successfulCalls: currentSuccess,
          disputedCalls: currentDispute,
          score: derivedScore,
          lastSyncedRound: latestRound,
          lastSyncedAt: new Date(),
        }
      });

    console.log(`[ReputationSync] Synced agent ${agentAddress} | Total: ${currentTotal} | Success: ${currentSuccess} | Dispute: ${currentDispute} | Cached Score: ${derivedScore.toFixed(1)}%`);
  } catch (error) {
    console.error(`[ReputationSync] Failed to sync reputation for agent ${agentAddress}:`, error);
  }
}
