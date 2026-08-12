import { Hono } from 'hono';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import crypto from 'crypto';

const auth = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'atomic_ai_router_secret_key_12345';

// Helper to generate JWT and set secure cookie
const setAuthCookie = (c: any, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  
  // sameSite: 'None' and secure: true are REQUIRED for cross-domain cookies to work (Vercel -> Railway/Render)
  setCookie(c, 'token', token, {
    httpOnly: true,
    secure: true, // Requires HTTPS (browsers allow secure cookies on localhost HTTP)
    sameSite: 'None', 
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

// ==========================================
// 1. REGISTER USER
// ==========================================
auth.post('/register', async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    if (!name || !email || !password) {
      return c.json({ error: true, message: 'Name, email, and password are required' }, 400);
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase())
    });

    if (existingUser) {
      return c.json({ error: true, message: 'Email already registered' }, 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    // Insert user with initial ledger balance (e.g. $100.0)
    await db.insert(users).values({
      id: userId,
      name,
      email: email.toLowerCase(),
      passwordHash,
      balance: 100.0, // Initial demo credits
    });

    // Set JWT Cookie
    setAuthCookie(c, userId);

    return c.json({
      success: true,
      user: {
        id: userId,
        name,
        email: email.toLowerCase(),
        balance: 100.0
      }
    }, 201);
  } catch (error: any) {
    console.error('Registration error:', error);
    return c.json({ error: true, message: 'Registration failed: ' + error.message }, 500);
  }
});

// ==========================================
// 2. LOGIN USER
// ==========================================
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: true, message: 'Email and password are required' }, 400);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase())
    });

    if (!user) {
      return c.json({ error: true, message: 'Invalid email or password' }, 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return c.json({ error: true, message: 'Invalid email or password' }, 401);
    }

    // Set JWT Cookie
    setAuthCookie(c, user.id);

    return c.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ error: true, message: 'Login failed: ' + error.message }, 500);
  }
});

// ==========================================
// 3. LOGOUT USER
// ==========================================
auth.post('/logout', async (c) => {
  deleteCookie(c, 'token', {
    path: '/',
    secure: true,
    sameSite: 'None'
  });
  return c.json({ success: true, message: 'Logged out successfully' });
});

// ==========================================
// 4. GET CURRENT USER (ME)
// ==========================================
auth.get('/me', async (c) => {
  try {
    const token = getCookie(c, 'token');
    
    if (!token) {
      return c.json({ error: true, code: 'UNAUTHORIZED', message: 'No authentication token provided' }, 401);
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return c.json({ error: true, code: 'UNAUTHORIZED', message: 'Invalid token' }, 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId)
    });

    if (!user) {
      return c.json({ error: true, code: 'UNAUTHORIZED', message: 'User not found' }, 401);
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (error: any) {
    console.error('Auth verification error:', error);
    return c.json({ error: true, message: 'Auth check failed: ' + error.message }, 500);
  }
});

export default auth;
