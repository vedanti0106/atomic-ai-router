# Atomic AI Router

An internet-native, multi-agent orchestration service router built on top of the **x402 Payment Protocol** and settled natively on the **Algorand Testnet**.

## Project Description

Atomic AI Router coordinates multiple downstream AI agents (e.g., Flight Search, Accommodations, Weather, and Budget Planning) to solve complex workflows atomically. By implementing the x402 protocol, the router facilitates zero-signup, machine-to-machine micropayments. AI agents can request payments dynamically per API call, and payments are settled instantly in testnet USDC without accounts, API keys, or manual payment flows.

---

## Business Model

**Pay-per-Call AI Agent Marketplace:** 
Atomic AI Router operates a transactional marketplace where developers and user agents pay strictly per API call. Every connected AI agent defines a micro-payment price in USDC (e.g., $0.01 per call) instead of forcing recurring monthly subscriptions. The router acts as a secure coordinator that takes a minimal routing fee per successful atomic execution. If any downstream agent fails, the atomic protocol guarantees a full refund of prior agent payments, ensuring zero financial loss for users.

---

## Architecture Overview

```
                 +-----------------------------------------+
                 |            React Frontend               |
                 +-------------------+---------------------+
                                     |
                                     | (API requests / JWT Auth)
                                     v
                 +-------------------+---------------------+
                 |            Hono Backend                 |
                 +--------+-----------------------+--------+
                          |                       |
                          | (Local State/Logs)    | (x402 Protocol Middleware)
                          v                       v
                 +--------+--------+     +--------+--------+
                 | SQLite Database |     |  x402 Resource  |
                 +-----------------+     |     Server      |
                                         +--------+--------+
                                                  |
                                                  | (Submit & Verify)
                                                  v
                                         +--------+--------+
                                         |   Plausible     |
                                         |  Facilitator    |
                                         +--------+--------+
                                                  |
                                                  | (On-Chain Settlement)
                                                  v
                                         +--------+--------+
                                         |    Algorand     |
                                         |    Testnet      |
                                         +-----------------+
```

1. **Frontend:** Single-page React application built with TypeScript and styled using modern CSS utilities. Monitors telemetry logs, database state, agent reputations, and payments in real time.
2. **Backend:** Hono REST API running on Node.js using an off-chain SQLite ledger managed by Drizzle ORM. Features password hashing via `bcryptjs` and secure HTTP-only JWT sessions.
3. **Payments Layer (x402):** Secure gateway integrating `@x402-avm/hono` and `@x402-avm/avm` schemes. Intercepts calls, throws `402 Payment Required` challenges, and verifies signatures on-chain via the Plausible Facilitator.

---

## The x402 Payment Flow

1. **Request:** Client makes an initial request to a protected API endpoint (e.g., `GET /api/premium/weather`).
2. **402 Challenge:** Server rejects the request with HTTP `402 Payment Required` and attaches a base64-encoded `payment-required` header detailing the price ($0.01 USDC), recipient address, network CAIP-2, and a unique cryptographic nonce.
3. **Transaction Creation:** Client wallet parses the challenge, constructs a matching USDC ASA transfer transaction, and signs it.
4. **Signature Submission:** Client sends the signed transaction to the Facilitator API.
5. **On-Chain Settlement:** Facilitator verifies, co-signs (if gas sponsored), and broadcasts the transaction to the Algorand Testnet.
6. **Access Retry:** Client retries the request attaching the payment proof in the `X-Payment` header.
7. **200 OK Response:** Server verifies the transaction finality on the Algorand ledger and returns the premium data.

---

## Setup & Running the Project

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize/Reset the local SQLite database and seed the default AI agents:
   ```bash
   npm run db:reset
   ```
4. Start the backend development server (runs on `http://localhost:3001`):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

---

## Running the x402 Algorand Verification Test

To verify the real on-chain x402 payment flow with your own eyes:

1. **Get the Credentials:** Run the keygen utility to check target addresses or generate new credentials:
   ```bash
   cd backend
   npx tsx src/utils/keygen.ts
   ```
2. **Fund the Client Wallet:** Ensure the test client wallet (`FUGQN6PVT6H33RHP6ILS2ETHLVM34DXKVWLO2LBKZLK4X2VW3YCHUNWKJE`) is funded:
   * **Testnet ALGO (for gas):** Dispense ALGO at [bank.testnet.algorand.network](https://bank.testnet.algorand.network/)
   * **Testnet USDC (for payment):** Request USDC at [faucet.circle.com](https://faucet.circle.com/) (select Algorand Testnet)
3. **Fund the Receiver Wallet:** Also dispense a small amount of testnet ALGO to the receiver address (`HSUQ6VRS7DOKPFYQCSXC2ORLVW63BX6LNPMAIFVMCRAKD4G6O3DBUL6DWQ`) to activate the account on-chain.
4. **Run the Test Script:**
   ```bash
   npx tsx src/test-x402.ts
   ```
   The script will print out the full step-by-step handshake: the 402 challenge, the signed payment transaction submission, the retry request, and the final 200 OK weather response with the real Algorand transaction ID.
