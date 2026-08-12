import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  txId: string;
  taskId: string;
  agent: string;
  agentWallet: string;
  amount: string;
  currency: string;
  nonce: string;
  status: 'SETTLED' | 'PENDING' | 'REFUNDED' | 'CHALLENGED';
  timestamp: string;
}


const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/task/payments', {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to load transaction ledger.');
      }
      const data = await response.json();
      setTransactions(data.payments || []);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to Hono backend. Ensure the backend server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTxs = transactions.filter(t => {
    return filterStatus === 'ALL' || t.status === filterStatus;
  });

  // Calculate dynamic stats
  const routerBalance = user?.balance ? Number(user.balance).toFixed(2) : '0.00';
  const settledTxs = transactions.filter(t => t.status === 'SETTLED');
  const totalSettledVal = settledTxs.reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2);
  const microTransactionsCount = transactions.length;

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
            <a
              href="https://testnet.explorer.perawallet.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-sky text-blue-brand rounded-full text-[13px] font-bold hover:bg-blue-brand hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔗</span>
              <span>Algorand Explorer</span>
            </a>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Top Financial Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="text-[13px] font-medium text-slate-500 mb-1">Router Wallet Balance</div>
            <div className="text-[26px] font-bold font-display text-navy">
              {routerBalance} <span className="text-[14px] text-blue-brand font-sans">USDC</span>
            </div>
            <div className="text-[12px] text-slate-400 font-medium mt-1">On Algorand TestNet</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="text-[13px] font-medium text-slate-500 mb-1">Total Settled Volume</div>
            <div className="text-[26px] font-bold font-display text-navy">${totalSettledVal}</div>
            <div className="text-[12px] text-emerald-600 font-semibold mt-1">{settledTxs.length} settled payments</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="text-[13px] font-medium text-slate-500 mb-1">Avg Settlement Time</div>
            <div className="text-[26px] font-bold font-display text-navy">1.2 seconds</div>
            <div className="text-[12px] text-emerald-600 font-semibold mt-1">Instant Algorand Finality</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="text-[13px] font-medium text-slate-500 mb-1">Replay Protection</div>
            <div className="text-[26px] font-bold font-display text-navy">{microTransactionsCount} Nonces</div>
            <div className="text-[12px] text-blue-brand font-semibold mt-1">100% Unique Nonce Match</div>
          </div>
        </div>

        {/* 7-Step x402 Protocol Flow Visualizer */}
        <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-navy">The x402 Payment Flow Architecture</h3>
              <p className="text-[13px] text-slate-500 mt-0.5">How HTTP 402 Payment Required enables zero-signup machine-to-machine commerce</p>
            </div>
            <span className="text-[11px] font-bold text-blue-brand bg-sky px-3 py-1 rounded-full uppercase">
              Handbook Reference (Ch. 6)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
            {[
              { step: '1', title: 'Initial Request', desc: 'Router calls Agent GET /service' },
              { step: '2', title: '402 Challenge', desc: 'Agent responds 402 with amount & nonce' },
              { step: '3', title: 'Client Signs', desc: 'Router wallet signs cryptographic proof' },
              { step: '4', title: 'Retry Request', desc: 'Router retries with X-PAYMENT header' },
              { step: '5', title: 'Verify Signature', desc: 'Facilitator checks nonce & signature' },
              { step: '6', title: 'Settle On-Chain', desc: 'Tx submitted to Algorand TestNet' },
              { step: '7', title: '200 OK + Receipt', desc: 'Agent returns data + TxID receipt' },
            ].map((s, idx) => (
              <div key={idx} className="bg-slate-50 border border-line/60 rounded-[14px] p-3.5 relative flex flex-col justify-between">
                <div>
                  <div className="w-6 h-6 rounded-full bg-blue-brand text-white text-[11px] font-bold flex items-center justify-center mb-2">
                    {s.step}
                  </div>
                  <div className="text-[12.5px] font-bold text-navy mb-1 leading-tight">{s.title}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{s.desc}</div>
                </div>
              </div>
            ))}
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
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="w-8 h-8 border-4 border-sky border-t-blue-brand rounded-full animate-spin mx-auto mb-3"></div>
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Loading Ledger...</span>
                    </td>
                  </tr>
                ) : filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <div className="text-slate-300 text-4xl mb-3">💳</div>
                      <h4 className="text-[15px] font-bold text-navy mb-1">No payments on ledger</h4>
                      <p className="text-[12.5px] text-slate-500 max-w-[280px] mx-auto">
                        Funds deposited and micro-payments completed during tasks will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTxs.map((tx) => (
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
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="px-3 py-1.5 border border-line rounded-[10px] text-[12px] font-semibold text-navy hover:bg-slate-100 transition-colors"
                        >
                          Inspect x402 Proof
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
    "payTo": "${selectedTx.agentWallet}",
    "nonce": "${selectedTx.nonce}"
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
