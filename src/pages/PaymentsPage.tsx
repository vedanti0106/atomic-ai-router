import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

type EscrowStatus = 'FUNDED' | 'RELEASED' | 'REFUNDED' | 'DISPUTED' | null;

interface Transaction {
  txId: string;
  taskId: string;
  agent: string;
  agentWallet: string;
  amount: string;
  currency: string;
  nonce: string;
  status: 'SETTLED' | 'PENDING' | 'REFUNDED' | 'CHALLENGED';
  escrowStatus: EscrowStatus;
  escrowTxId?: string;
  timestamp: string;
}

const mockTransactions: Transaction[] = [
  {
    txId: 'TX_ALG_99201A843F',
    taskId: 'task_9f31ab',
    agent: 'Flight AI',
    agentWallet: 'ALGO_FLIGHT_W481...9X',
    amount: '3.00',
    currency: 'USDC',
    nonce: '8f0a1c93',
    status: 'SETTLED',
    escrowStatus: 'RELEASED',
    escrowTxId: 'TX_ALG_REL_9921B',
    timestamp: '2 mins ago'
  },
  {
    txId: 'TX_ALG_99201B421E',
    taskId: 'task_9f31ab',
    agent: 'Hotel AI',
    agentWallet: 'ALGO_HOTEL_W912...4K',
    amount: '2.50',
    currency: 'USDC',
    nonce: '3d2b9a71',
    status: 'SETTLED',
    escrowStatus: 'RELEASED',
    escrowTxId: 'TX_ALG_REL_9921C',
    timestamp: '2 mins ago'
  },
  {
    txId: 'TX_ALG_77810C110A',
    taskId: 'task_77a11e',
    agent: 'Symptom Checker AI',
    agentWallet: 'ALGO_HEALTH_W331...2M',
    amount: '4.00',
    currency: 'USDC',
    nonce: '1a90c4f8',
    status: 'REFUNDED',
    escrowStatus: 'REFUNDED',
    escrowTxId: 'REFUND_TX_1102A',
    timestamp: '15 mins ago'
  },
  {
    txId: 'TX_ALG_65192D890C',
    taskId: 'task_65b99f',
    agent: 'OCR Reader AI',
    agentWallet: 'ALGO_OCR_W772...1P',
    amount: '5.00',
    currency: 'USDC',
    nonce: '7c44e9b2',
    status: 'SETTLED',
    escrowStatus: 'RELEASED',
    escrowTxId: 'TX_ALG_REL_7841A',
    timestamp: '1 hour ago'
  },
  {
    txId: 'TX_ALG_54109E334B',
    taskId: 'task_88c42d',
    agent: 'Price Scraper AI',
    agentWallet: 'ALGO_SHOP_W109...8L',
    amount: '1.50',
    currency: 'USDC',
    nonce: '9b110a34',
    status: 'PENDING',
    escrowStatus: 'FUNDED',
    timestamp: 'Just now'
  }
];

const PaymentsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTxs = mockTransactions.filter(t => {
    return filterStatus === 'ALL' || t.status === filterStatus;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">x402 Payments & Algorand Ledger</h1>
            <p className="text-[14px] md:text-[15px] text-slate-500 mt-1">
              Inspect zero-setup machine-to-machine micro-payments settled natively via x402 protocol on Algorand TestNet.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('Opening Algorand TestNet Explorer for wallet...')}
              className="px-4 py-2.5 bg-sky text-blue-brand rounded-full text-[13px] font-bold hover:bg-blue-brand hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>🔗</span>
              <span>Algorand Explorer</span>
            </button>
          </div>
        </div>

        {/* Top Financial Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="text-[13px] font-medium text-slate-500 mb-1">Router Wallet Balance</div>
            <div className="text-[26px] font-bold font-display text-navy">
              1,450.00 <span className="text-[14px] text-blue-brand font-sans">USDC</span>
            </div>
            <div className="text-[12px] text-slate-400 font-medium mt-1">48.5 ALGO (Gas Reserve)</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="text-[13px] font-medium text-slate-500 mb-1">Total Settled Volume</div>
            <div className="text-[26px] font-bold font-display text-navy">$4,280.50</div>
            <div className="text-[12px] text-emerald-600 font-semibold mt-1">1,840 Micro-transactions</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="text-[13px] font-medium text-slate-500 mb-1">Avg Settlement Time</div>
            <div className="text-[26px] font-bold font-display text-navy">1.2 seconds</div>
            <div className="text-[12px] text-emerald-600 font-semibold mt-1">Instant Algorand Finality</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="text-[13px] font-medium text-slate-500 mb-1">Replay Protection</div>
            <div className="text-[26px] font-bold font-display text-navy">842 Nonces</div>
            <div className="text-[12px] text-blue-brand font-semibold mt-1">100% Unique Nonce Match</div>
          </div>

          {/* NEW: Escrow Health card */}
          <div className="bg-amber-50 rounded-[20px] p-6 border border-amber-200 shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[13px] font-medium text-amber-700">Escrow Health</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <div className="text-[26px] font-bold font-display text-amber-800">
              2 Active
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              🔒 $11.00 USDC locked
            </div>
            <div className="text-[11px] text-amber-600 mt-0.5">
              App ID 741,209,831
            </div>
          </div>
        </div>

        {/* 9-Step x402 + Escrow Flow Visualizer */}
        <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-navy">x402 + Trustless Escrow Payment Flow</h3>
              <p className="text-[13px] text-slate-500 mt-0.5">Funds are held on-chain by a neutral smart contract — released only on verified delivery</p>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase">
              Escrow Enhanced
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2 md:gap-2.5">
            {[
              { step: '1', title: 'Initial Request',   desc: 'Router calls Agent GET /service',           color: 'bg-blue-brand', highlight: false },
              { step: '2', title: '402 Challenge',      desc: 'Agent returns 402 — payTo = Escrow App',   color: 'bg-blue-brand', highlight: false },
              { step: '3', title: 'Fund Escrow',        desc: 'fund_escrow() — USDC locked in contract',  color: 'bg-amber-500',  highlight: true  },
              { step: '4', title: 'Client Signs',       desc: 'Router signs x402 proof with wallet key',  color: 'bg-blue-brand', highlight: false },
              { step: '5', title: 'Retry + Header',     desc: 'Router retries with X-PAYMENT header',     color: 'bg-blue-brand', highlight: false },
              { step: '6', title: 'Verify Signature',   desc: 'Facilitator checks nonce & signature',     color: 'bg-blue-brand', highlight: false },
              { step: '7', title: 'Agent Delivers',     desc: 'Agent executes task & returns response',   color: 'bg-blue-brand', highlight: false },
              { step: '8', title: 'Release Escrow',     desc: 'release_escrow() — proof hash stored',     color: 'bg-emerald-600',highlight: true  },
              { step: '9', title: '200 OK + TxID',      desc: 'Confirmed receipt + Algorand explorer link',color: 'bg-blue-brand', highlight: false },
            ].map((s, idx) => (
              <div key={idx} className={`rounded-[14px] p-3.5 flex flex-col justify-between border ${s.highlight ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-line/60'}`}>
                <div>
                  <div className={`w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center mb-2 ${s.color}`}>
                    {s.step}
                  </div>
                  <div className={`text-[12px] font-bold mb-1 leading-tight ${s.highlight ? 'text-amber-800' : 'text-navy'}`}>{s.title}</div>
                  <div className={`text-[10.5px] leading-snug ${s.highlight ? 'text-amber-600' : 'text-slate-500'}`}>{s.desc}</div>
                </div>
                {s.highlight && <div className="mt-2 text-[10px] font-bold text-amber-600">🔒 On-chain</div>}
              </div>
            ))}
          </div>

          {/* Timeout / auto-refund note */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-[12px] text-[12px] text-blue-800 flex items-start gap-2">
            <span className="text-lg leading-none">↩</span>
            <span><span className="font-bold">Auto-Refund Path:</span> If agent never delivers, <code className="bg-blue-100 px-1 rounded">refund_escrow()</code> fires automatically after the deadline round passes — permissionless, no human intervention required. Payer gets 100% back on-chain.</span>
          </div>
        </div>

        {/* Transactions Table & Filters */}
        <div className="bg-white rounded-[24px] border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] overflow-hidden">
          <div className="p-6 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[16px] font-bold text-navy">Payment Transaction Ledger</h3>
              <p className="text-[12.5px] text-slate-500 mt-0.5">Real-time micro-payments settled on Algorand</p>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-[12px]">
              {['ALL', 'SETTLED', 'PENDING', 'REFUNDED'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-3 py-1.5 rounded-[9px] text-[12px] font-bold transition-all ${
                    filterStatus === tab 
                      ? 'bg-white text-navy shadow-sm' 
                      : 'text-slate-500 hover:text-navy'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-line">
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Algorand TxID</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Task ID</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Recipient Agent</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Nonce</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Escrow</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredTxs.map((tx) => (
                  <tr key={tx.txId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-[13px] font-bold text-blue-brand">
                      {tx.txId}
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">{tx.timestamp}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[13px] font-medium text-navy">
                      {tx.taskId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-[13.5px] font-bold text-navy">{tx.agent}</div>
                      <div className="font-mono text-[11px] text-slate-400 truncate max-w-[140px]">{tx.agentWallet}</div>
                    </td>
                    <td className="py-4 px-6 font-display font-bold text-navy text-[14px]">
                      ${tx.amount} <span className="text-[11px] font-medium text-slate-400">{tx.currency}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[12px] text-slate-500">
                      {tx.nonce}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                        tx.status === 'SETTLED' ? 'bg-[#E3FBF5] text-[#0E7D69]' :
                        tx.status === 'PENDING' ? 'bg-sky text-blue-brand animate-pulse' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {tx.escrowStatus ? (
                        <div className="flex flex-col gap-0.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold w-fit ${
                            tx.escrowStatus === 'RELEASED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            tx.escrowStatus === 'REFUNDED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            tx.escrowStatus === 'FUNDED'   ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {tx.escrowStatus === 'RELEASED' ? '✅' : tx.escrowStatus === 'REFUNDED' ? '↩' : tx.escrowStatus === 'FUNDED' ? '🔒' : '⚠'} {tx.escrowStatus}
                          </span>
                          {tx.escrowTxId && (
                            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]">{tx.escrowTxId}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-3 py-1.5 border border-line rounded-[10px] text-[12px] font-semibold text-navy hover:bg-slate-100 transition-colors"
                      >
                        Inspect x402 Proof
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: x402 Proof Inspector */}
        {selectedTx && (
          <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="bg-white rounded-t-[24px] sm:rounded-[24px] max-w-lg w-full p-5 md:p-7 shadow-2xl border border-line max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-start mb-5 pb-3 border-b border-line">
                <div>
                  <h3 className="text-[17px] font-bold text-navy">x402 Cryptographic Proof</h3>
                  <p className="text-[12px] text-slate-500">HTTP 402 Challenge & Signature Payload</p>
                </div>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-[14px] p-4 font-mono text-[12px] overflow-x-auto mb-5 leading-relaxed">
{`{
  "status": 402,
  "statusText": "Payment Required",
  "challenge": {
    "amount": "${selectedTx.amount}",
    "currency": "${selectedTx.currency}",
    "payTo": "ESCROW_APP_ADDR_741209831",
    "nonce": "${selectedTx.nonce}"
  },
  "escrow": {
    "appId": 741209831,
    "boxKey": "${selectedTx.taskId}",
    "status": "${selectedTx.escrowStatus ?? 'N/A'}",
    "deadlineRounds": 300
  },
  "signature": "sig_algorand_ed25519_${selectedTx.nonce}_ok",
  "txId": "${selectedTx.txId}",
  "network": "Algorand TestNet"
}`}
              </div>

              <div className="p-3 bg-sky/50 rounded-[12px] border border-blue-brand/20 text-[12.5px] text-navy mb-5">
                <span className="font-bold">Verification:</span> Cryptographically verified by Facilitator service before agent executed requested AI task.
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-[13px] font-bold rounded-full hover:bg-slate-200"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
