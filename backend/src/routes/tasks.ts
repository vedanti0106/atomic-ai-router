import { Hono } from 'hono';
import { db } from '../db/index.js';
import { users, tasks, escrows, logs, transactions, payments, agents } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';
import crypto from 'crypto';

const tasksRouter = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'atomic_ai_router_secret_key_12345';

// Auth middleware helper
const getUserIdFromCookie = (c: any): string | null => {
  const token = getCookie(c, 'token');
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
};

// Simulated on-chain Algorand escrow funding
async function fundEscrowOnChain(taskId: string, amount: number) {
  // Simulate network latency of block confirmation
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate potential on-chain failures for verification purposes
  if (amount <= 0) {
    throw new Error('Algorand: Invalid transaction amount');
  }
  if (amount > 1000) {
    throw new Error('Algorand: Insufficient custodial wallet funds (Simulated Algorand error)');
  }

  return {
    appId: Math.floor(10000000 + Math.random() * 90000000).toString(), // Mock App ID
    boxKey: `task_box_${taskId.slice(0, 8)}`,
    txid: crypto.randomBytes(32).toString('hex'),
    deadlineRound: 42100500 + Math.floor(Math.random() * 1000), // Mock Algorand round
  };
}

// ==========================================
// 1. KICK OFF TASK (ATOMIC DB TRANSACTION)
// ==========================================
tasksRouter.post('/', async (c) => {
  const userId = getUserIdFromCookie(c);
  if (!userId) {
    return c.json({ error: true, code: 'UNAUTHORIZED', message: 'Sign-in required to create tasks' }, 401);
  }

  try {
    const { goal, amount = 10.0 } = await c.req.json(); // Default cost: 10 USDC

    if (!goal) {
      return c.json({ error: true, message: 'Goal description is required' }, 400);
    }

    const taskId = `task_${crypto.randomUUID().slice(0, 18)}`;

    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!userRecord) {
      return c.json({ error: true, message: 'User account not found' }, 404);
    }

    if (userRecord.balance < amount) {
      return c.json({ error: true, code: 'INSUFFICIENT_FUNDS', message: 'Insufficient balance' }, 402);
    }

    // Call simulated on-chain Algorand escrow creation outside database transaction
    const onChainDetails = await fundEscrowOnChain(taskId, amount);

    try {
      db.transaction((tx) => {
        // Step A: Re-verify balance inside transaction to prevent double spending
        const userRecordTx = tx.select().from(users).where(eq(users.id, userId)).all()[0];
        if (!userRecordTx || userRecordTx.balance < amount) {
          throw new Error('INSUFFICIENT_BALANCE');
        }

        // Step B: Deduct the ledger balance
        const newBalance = userRecordTx.balance - amount;
        tx.update(users)
          .set({ balance: newBalance })
          .where(eq(users.id, userId))
          .run();

        // Step D: Record Task
        tx.insert(tasks).values({
          id: taskId,
          userId,
          goal,
          status: 'IN_PROGRESS',
        }).run();

        // Step E: Record Escrow Contract details
        tx.insert(escrows).values({
          id: crypto.randomUUID(),
          taskId,
          appId: onChainDetails.appId,
          boxKey: onChainDetails.boxKey,
          payerAddress: 'ROUTER_CUSTODIAL_WALLET_ADDRESS',
          agentAddress: 'AGENT_HOTEL_WALLET_ADDRESS', // Mock agent address
          amount,
          status: 'FUNDED',
          deadlineRound: onChainDetails.deadlineRound,
          txidFund: onChainDetails.txid,
        }).run();

        // Step F: Record log of the atomic allocation
        tx.insert(logs).values({
          id: crypto.randomUUID(),
          taskId,
          level: 'INFO',
          message: `Deducted $${amount} off-chain balance and successfully funded on-chain escrow App ${onChainDetails.appId}.`,
          metadata: JSON.stringify({ txidFund: onChainDetails.txid }),
        }).run();
      });
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') {
        return c.json({ error: true, message: 'User account not found' }, 404);
      }
      if (err.message === 'INSUFFICIENT_BALANCE') {
        return c.json({ error: true, code: 'INSUFFICIENT_FUNDS', message: 'Insufficient balance' }, 402);
      }
      console.error('Atomic allocation rolled back:', err);
      return c.json({
        error: true,
        code: 'BLOCKCHAIN_FAIL',
        message: `Task creation aborted: ${err.message}. Your balance has not been charged.`,
      }, 503);
    }

    return c.json({
      success: true,
      taskId,
      status: 'IN_PROGRESS',
      escrow: {
        appId: onChainDetails.appId,
        txid: onChainDetails.txid,
        amount,
      }
    }, 202);
  } catch (error: any) {
    console.error('Task setup error:', error);
    return c.json({ error: true, message: 'Failed to launch task: ' + error.message }, 500);
  }
});

// ==========================================
// 2. GET TASK STATUS
// ==========================================
tasksRouter.get('/status/:taskId', async (c) => {
  const taskId = c.req.param('taskId');
  const userId = getUserIdFromCookie(c);
  if (!userId) {
    return c.json({ error: true, message: 'Unauthorized' }, 401);
  }

  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId)
    });

    if (!task) {
      return c.json({ error: true, message: 'Task not found' }, 404);
    }

    // Mock response matching status schema
    return c.json({
      taskId,
      status: task.status,
      completedAgents: task.status === 'SUCCESS' ? ['flight-agent', 'hotel-agent', 'weather-agent'] : [],
      pendingAgents: task.status === 'IN_PROGRESS' ? ['hotel-agent'] : [],
    });
  } catch (error: any) {
    return c.json({ error: true, message: 'Failed to query task status: ' + error.message }, 500);
  }
});

// ==========================================
// 3. GET TASK RECEIPT
// ==========================================
tasksRouter.get('/receipt/:taskId', async (c) => {
  const taskId = c.req.param('taskId');
  const userId = getUserIdFromCookie(c);
  if (!userId) {
    return c.json({ error: true, message: 'Unauthorized' }, 401);
  }

  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId)
    });
    if (!task) {
      return c.json({ error: true, message: 'Task not found' }, 404);
    }

    const escrowRecord = await db.query.escrows.findFirst({
      where: eq(escrows.taskId, taskId)
    });

    return c.json({
      taskId,
      payments: [
        {
          agent: 'flight-agent',
          amount: '5.00',
          txId: escrowRecord?.txidFund || 'TXID_FLIGHT_MOCK_1',
        },
        {
          agent: 'hotel-agent',
          amount: '5.00',
          txId: escrowRecord?.txidResolution || 'TXID_HOTEL_PENDING_OR_RESOLVED',
        }
      ],
      total: escrowRecord?.amount.toFixed(2) || '10.00',
      currency: 'USDC',
    });
  } catch (error: any) {
    return c.json({ error: true, message: 'Failed to query receipt: ' + error.message }, 500);
  }
});

// ==========================================
// 4. GET ALL LOGS (FOR AUDIT VISUALIZATION)
// ==========================================
tasksRouter.get('/logs', async (c) => {
  try {
    const allLogs = await db.query.logs.findMany({
      orderBy: (logs, { desc }) => [desc(logs.createdAt)],
      limit: 100
    });

    const formattedLogs = allLogs.map(l => ({
      id: l.id,
      timestamp: l.createdAt.toLocaleTimeString('en-US', { hour12: false }),
      level: l.level as any,
      taskId: l.taskId || undefined,
      source: l.level === 'x402' ? 'Payment Module' : 'Router Service',
      message: l.message,
      metadata: l.metadata ? JSON.parse(l.metadata) : undefined
    }));

    return c.json({ success: true, logs: formattedLogs });
  } catch (error: any) {
    return c.json({ error: true, message: 'Failed to query logs: ' + error.message }, 500);
  }
});

// ==========================================
// 5. DATABASE INSPECTOR (FOR LIVE DEMO)
// ==========================================
tasksRouter.get('/db-inspector', async (c) => {
  try {
    const allUsers = await db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)]
    });
    const allTasks = await db.query.tasks.findMany({
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)]
    });
    const allEscrows = await db.query.escrows.findMany({
      orderBy: (escrows, { desc }) => [desc(escrows.createdAt)]
    });

    return c.json({
      success: true,
      users: allUsers,
      tasks: allTasks,
      escrows: allEscrows
    });
  } catch (error: any) {
    return c.json({ error: true, message: 'Failed to inspect database: ' + error.message }, 500);
  }
});

// ==========================================
// 6. GET ALL TASKS FOR CURRENT USER
// ==========================================
tasksRouter.get('/', async (c) => {
  const userId = getUserIdFromCookie(c);
  if (!userId) {
    return c.json({ error: true, code: 'UNAUTHORIZED', message: 'Sign-in required' }, 401);
  }
  try {
    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)]
    });

    const enrichedTasks = [];
    for (const t of userTasks) {
      const escrowRecord = await db.query.escrows.findFirst({
        where: eq(escrows.taskId, t.id)
      });
      
      const status = t.status as 'SUCCESS' | 'IN_PROGRESS' | 'FAILED' | 'ROLLED_BACK';
      
      let agentsList: any[] = [];
      if (status === 'SUCCESS') {
        agentsList = [
          { name: 'Flight AI', icon: '✈', price: '3.00', status: 'COMPLETED', txId: escrowRecord?.txidFund || 'ALGO_TX_MOCK1', latency: '620ms' },
          { name: 'Hotel AI', icon: '🛏', price: '2.50', status: 'COMPLETED', txId: escrowRecord?.txidResolution || 'ALGO_TX_MOCK2', latency: '890ms' },
          { name: 'Weather AI', icon: '☀', price: '0.50', status: 'COMPLETED', txId: 'ALGO_TX_MOCK3', latency: '210ms' },
          { name: 'Finance AI', icon: '💳', price: '4.00', status: 'COMPLETED', txId: 'ALGO_TX_MOCK4', latency: '450ms' },
        ];
      } else if (status === 'IN_PROGRESS') {
        agentsList = [
          { name: 'Flight AI', icon: '✈', price: '3.00', status: 'COMPLETED', txId: escrowRecord?.txidFund || 'ALGO_TX_MOCK1', latency: '540ms' },
          { name: 'Hotel AI', icon: '🛏', price: '2.50', status: 'RUNNING', latency: '310ms' },
          { name: 'Finance AI', icon: '💳', price: '0.00', status: 'RUNNING', latency: '0ms' }
        ];
      } else if (status === 'ROLLED_BACK' || status === 'FAILED') {
        agentsList = [
          { name: 'Flight AI', icon: '✈', price: '3.00', status: 'ROLLED_BACK', txId: 'REFUND_TX_MOCK1', latency: '710ms' },
          { name: 'Hotel AI', icon: '🛏', price: '2.50', status: 'ROLLED_BACK', txId: 'REFUND_TX_MOCK2', latency: '430ms' },
          { name: 'Weather AI', icon: '☀', price: '4.50', status: 'FAILED', latency: 'timeout' }
        ];
      }

      let executionTime = '4.2s';
      if (t.completedAt) {
        const diffMs = t.completedAt.getTime() - t.createdAt.getTime();
        executionTime = `${(diffMs / 1000).toFixed(1)}s`;
      }

      enrichedTasks.push({
        id: t.id,
        goal: t.goal,
        userId: t.userId,
        status: t.status,
        createdAt: t.createdAt.toLocaleDateString() + ' ' + t.createdAt.toLocaleTimeString(),
        totalCost: escrowRecord?.amount ? escrowRecord.amount.toFixed(2) : '10.00',
        currency: 'USDC',
        executionTime,
        agents: agentsList
      });
    }

    return c.json({ success: true, tasks: enrichedTasks });
  } catch (error: any) {
    return c.json({ error: true, message: 'Failed to query tasks: ' + error.message }, 500);
  }
});

// ==========================================
// 7. GET PAYMENTS FOR CURRENT USER
// ==========================================
tasksRouter.get('/payments', async (c) => {
  const userId = getUserIdFromCookie(c);
  if (!userId) {
    return c.json({ error: true, code: 'UNAUTHORIZED', message: 'Sign-in required' }, 401);
  }
  try {
    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId)
    });
    const taskIds = userTasks.map(t => t.id);

    if (taskIds.length === 0) {
      return c.json({ success: true, payments: [] });
    }

    const allEscrows = await db.query.escrows.findMany({
      orderBy: (escrows, { desc }) => [desc(escrows.createdAt)]
    });

    const userEscrows = allEscrows.filter(e => taskIds.includes(e.taskId));

    const formattedPayments = userEscrows.map(e => {
      let displayStatus: 'SETTLED' | 'PENDING' | 'REFUNDED' | 'CHALLENGED' = 'SETTLED';
      if (e.status === 'REFUNDED') {
        displayStatus = 'REFUNDED';
      } else if (e.status === 'PENDING') {
        displayStatus = 'PENDING';
      }

      return {
        txId: e.txidFund,
        taskId: e.taskId,
        agent: 'Hotel AI & Flight AI',
        agentWallet: e.agentAddress,
        amount: e.amount.toFixed(2),
        currency: 'USDC',
        nonce: e.boxKey,
        status: displayStatus,
        timestamp: e.createdAt.toLocaleDateString() + ' ' + e.createdAt.toLocaleTimeString()
      };
    });

    return c.json({ success: true, payments: formattedPayments });
  } catch (error: any) {
    return c.json({ error: true, message: 'Failed to query payments: ' + error.message }, 500);
  }
});

// ==========================================
// 8. GET ALL ACTIVE AGENTS
// ==========================================
tasksRouter.get('/agents', async (c) => {
  const userId = getUserIdFromCookie(c);
  if (!userId) {
    return c.json({ error: true, code: 'UNAUTHORIZED', message: 'Sign-in required' }, 401);
  }
  try {
    const allAgents = await db.query.agents.findMany();
    const formattedAgents = allAgents.map(a => {
      let load = '45%';
      let latency = '65ms';
      if (a.name === 'Flight AI') { load = '68%'; latency = '38ms'; }
      else if (a.name === 'Weather AI') { load = '12%'; latency = '28ms'; }
      else if (a.name === 'Finance AI') { load = '92%'; latency = '125ms'; }
      else if (a.name === 'Maps AI') { load = '34%'; latency = '35ms'; }

      return {
        name: a.name,
        icon: a.name === 'Flight AI' ? '✈' : a.name === 'Weather AI' ? '☀' : a.name === 'Finance AI' ? '💳' : a.name === 'Maps AI' ? '🗺' : '🛏',
        desc: a.name === 'Flight AI' ? 'Finds and books optimal flight routes.' :
              a.name === 'Hotel AI' ? 'Searches and reserves accommodations.' :
              a.name === 'Weather AI' ? 'Provides real-time weather forecasts.' :
              a.name === 'Finance AI' ? 'Handles budgets and secure payments.' : 'Calculates routes and distances.',
        status: a.status === 'ACTIVE' ? 'Online' : 'Offline',
        load,
        latency,
        success: a.reputationScore.toFixed(1) + '%',
        tags: a.name === 'Flight AI' ? ['Flight Search', 'Price Prediction', 'Booking'] :
              a.name === 'Hotel AI' ? ['Hotel Search', 'Reviews', 'Booking'] :
              a.name === 'Weather AI' ? ['Forecast', 'Alerts', 'Climate'] :
              a.name === 'Finance AI' ? ['Budget', 'Currency', 'Optimization'] : ['Navigation', 'Traffic', 'Distance']
      };
    });

    return c.json({ success: true, agents: formattedAgents });
  } catch (error: any) {
    return c.json({ error: true, message: 'Failed to query agents: ' + error.message }, 500);
  }
});

// ==========================================
// 9. GET DYNAMIC DASHBOARD METRICS
// ==========================================
tasksRouter.get('/dashboard', async (c) => {
  const userId = getUserIdFromCookie(c);
  if (!userId) {
    return c.json({ error: true, code: 'UNAUTHORIZED', message: 'Sign-in required' }, 401);
  }

  try {
    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)]
    });

    const totalTasks = userTasks.length;
    const successTasks = userTasks.filter(t => t.status === 'SUCCESS').length;
    const successRate = totalTasks === 0 ? 100.0 : (successTasks / totalTasks) * 100;

    const taskIds = userTasks.map(t => t.id);
    let settledVolume = 0;
    let paymentCount = 0;

    if (taskIds.length > 0) {
      const allEscrows = await db.query.escrows.findMany();
      const userEscrows = allEscrows.filter(e => taskIds.includes(e.taskId));
      settledVolume = userEscrows
        .filter(e => e.status === 'FUNDED' || e.status === 'RELEASED')
        .reduce((sum, e) => sum + e.amount, 0);
      paymentCount = userEscrows.length;
    }

    const recentTasks = userTasks.slice(0, 5).map(t => {
      return {
        time: t.createdAt.toLocaleTimeString('en-US', { hour12: false }),
        req: `REQ-${t.id.slice(5, 9).toUpperCase()}`,
        agent: 'Hotel AI & Flight AI',
        status: t.status === 'SUCCESS' ? 'Success' : t.status === 'IN_PROGRESS' ? 'Running' : 'Failed'
      };
    });

    let timeline: any[] = [];
    if (taskIds.length > 0) {
      const allLogs = await db.query.logs.findMany({
        orderBy: (logs, { desc }) => [desc(logs.createdAt)],
        limit: 20
      });
      const userLogs = allLogs.filter(l => l.taskId && taskIds.includes(l.taskId));
      timeline = userLogs.slice(0, 5).map(l => {
        return {
          agent: l.level === 'x402' ? 'Payment Module' : 'Router Service',
          time: l.createdAt.toLocaleTimeString('en-US', { hour12: false }),
          status: l.level === 'x402' ? 'Completed' : 'Running'
        };
      });
    }

    const allAgents = await db.query.agents.findMany({
      where: eq(agents.status, 'ACTIVE')
    });

    return c.json({
      success: true,
      metrics: {
        totalRequests: totalTasks.toLocaleString(),
        activeAgents: allAgents.length.toString(),
        successRate: `${successRate.toFixed(1)}%`,
        settledVolume: settledVolume.toFixed(2),
        paymentCount: paymentCount.toLocaleString(),
      },
      recentExecutions: recentTasks,
      timelineActivity: timeline,
      agentOverview: allAgents.map(a => ({
        name: a.name,
        status: a.status === 'ACTIVE' ? 'Online' : 'Offline',
        latency: a.name === 'Flight AI' ? '38ms' : a.name === 'Weather AI' ? '28ms' : '65ms',
        avail: a.reputationScore.toFixed(1) + '%'
      }))
    });
  } catch (error: any) {
    return c.json({ error: true, message: 'Failed to build dashboard metrics: ' + error.message }, 500);
  }
});

export default tasksRouter;
