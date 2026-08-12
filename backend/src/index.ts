import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth.js';
import tasksRouter from './routes/tasks.js';
import premiumRouter from './routes/premium.js';
import dotenv from 'dotenv';

dotenv.config();

const app = new Hono();

// Read frontend origin from env, fallback to localhost for development
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// CORS configuration:
// 1. MUST use an explicit origin (not '*') when credentials: true is enabled.
// 2. credentials: true is required to allow the browser to transmit secure HTTP-only cookies cross-origin.
app.use('/api/*', cors({
  origin: (origin) => {
    if (!origin) return FRONTEND_ORIGIN;
    // Allow any local host port for developer convenience
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return origin;
    }
    return FRONTEND_ORIGIN;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

app.get('/', (c) => c.text('Atomic AI Router Backend is running!'));

// Mount auth, tasks, and premium routes
app.route('/api/auth', auth);
app.route('/api/task', tasksRouter);
app.route('/api/premium', premiumRouter);


const port = parseInt(process.env.PORT || '3001');
console.log(`[Hono Server] Running on http://localhost:${port}`);
console.log(`[Hono Server] Expected Frontend CORS Origin: ${FRONTEND_ORIGIN}`);

serve({
  fetch: app.fetch,
  port
});
export default app;
