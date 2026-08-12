import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface WalletData {
  address: string;
  algo: number;
  usdc: number;
  optedIn: boolean;
}

interface BalanceData {
  client: WalletData;
  receiver: WalletData;
}

const X402DemoPage: React.FC = () => {
  const [balances, setBalances] = useState<BalanceData | null>(null);
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [resultData, setResultData] = useState<any>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/premium/balances');
      if (res.ok) {
        const data = await res.json();
        setBalances(data);
      }
    } catch (err) {
      console.error('Error fetching balances:', err);
    } finally {
      setLoadingBalances(false);
    }
  };

  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, []);

  const runSimulation = async () => {
    setSimulationRunning(true);
    setLogs([]);
    setResultData(null);
    setTxId(null);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/premium/run-simulation', {
        method: 'POST',
      });
      const result = await res.json();
      
      setLogs(result.logs || []);
      
      if (res.ok && result.success) {
        setResultData(result.data);
        setTxId(result.txId);
        fetchBalances(); // Refresh balances immediately
      } else {
        setError(result.logs?.[result.logs.length - 1] || 'Simulation failed.');
      }
    } catch (err: any) {
      setError('Connection error: Make sure the Hono backend is running.');
    } finally {
      setSimulationRunning(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">
            x402 Micropayments Sandbox
          </h1>
          <p className="text-[14px] md:text-[15px] text-slate-500 mt-1">
            Simulate and verify machine-to-machine API payments on the Algorand Testnet.
          </p>
        </div>

        {/* Wallets & Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Wallet Card */}
          <div className="bg-white rounded-[24px] p-6 border border-line shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-navy flex items-center gap-2">
                🤖 Client Wallet (AI Agent)
              </h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 uppercase">
                Payer
              </span>
            </div>
            
            {loadingBalances ? (
              <div className="h-20 flex items-center justify-center text-slate-400 text-xs">
                Fetching account state...
              </div>
            ) : balances ? (
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Address</div>
                  <div className="text-xs font-mono text-slate-600 break-all select-all">{balances.client.address}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ALGO (Gas)</div>
                    <div className="text-lg font-bold text-navy">{balances.client.algo.toFixed(3)} ALGO</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">USDC (Payment)</div>
                    <div className="text-lg font-bold text-blue-brand">${balances.client.usdc.toFixed(2)} USDC</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${balances.client.optedIn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    USDC Asset: {balances.client.optedIn ? 'Opted In' : 'Not Opted In'}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Receiver Wallet Card */}
          <div className="bg-white rounded-[24px] p-6 border border-line shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-navy flex items-center gap-2">
                🗄️ Receiver Wallet (API Provider)
              </h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-brand uppercase">
                Receiver
              </span>
            </div>

            {loadingBalances ? (
              <div className="h-20 flex items-center justify-center text-slate-400 text-xs">
                Fetching account state...
              </div>
            ) : balances ? (
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Address</div>
                  <div className="text-xs font-mono text-slate-600 break-all select-all">{balances.receiver.address}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ALGO (Gas)</div>
                    <div className="text-lg font-bold text-navy">{balances.receiver.algo.toFixed(3)} ALGO</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">USDC (Volume)</div>
                    <div className="text-lg font-bold text-blue-brand">${balances.receiver.usdc.toFixed(2)} USDC</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${balances.receiver.optedIn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    USDC Asset: {balances.receiver.optedIn ? 'Opted In' : 'Not Opted In'}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Sandbox Console & Simulation */}
        <div className="bg-[#0f172a] rounded-[24px] border border-slate-800 p-6 md:p-8 text-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-[18px] font-bold text-white flex items-center gap-2">
                💻 Simulation Console
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Triggers a simulated client agent call, handles the 402, and settles payment live on-chain.
              </p>
            </div>
            <button
              onClick={runSimulation}
              disabled={simulationRunning}
              className={`w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold shadow-md transition-colors ${
                simulationRunning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-brand hover:bg-blue-brand/90 text-white'
              }`}
            >
              {simulationRunning ? '⏳ Settling On-Chain...' : '⚡ Trigger x402 Payment Flow'}
            </button>
          </div>

          {/* Console Screen */}
          <div className="bg-[#020617] rounded-xl border border-slate-800 p-4 font-mono text-xs text-green-400 space-y-2.5 min-h-[180px] flex flex-col justify-end">
            {logs.length === 0 && !simulationRunning && (
              <div className="text-slate-500 text-center py-12">
                Click "Trigger x402 Payment Flow" above to start the demo.
              </div>
            )}
            
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-500 select-none">&gt;</span>
                <span className={log.includes('failed') ? 'text-red-400' : log.includes('OK') || log.includes('successfully') ? 'text-blue-400 font-bold' : ''}>
                  {log}
                </span>
              </div>
            ))}
            
            {simulationRunning && (
              <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                <span>&gt; Connecting to Algorand Testnet node...</span>
                <span className="w-1.5 h-4 bg-slate-400 animate-caret" />
              </div>
            )}
          </div>

          {/* Result Cards */}
          {(resultData || txId || error) && (
            <div className="border-t border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: API Data or Error */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {error ? '❌ Simulation Failure' : '📦 Returned Weather API Data'}
                </h3>
                {error ? (
                  <div className="bg-red-950/40 border border-red-900 rounded-xl p-4 text-red-400 text-xs">
                    {error}
                    <div className="mt-2 text-[10px] text-red-500 font-semibold">
                      Make sure your Client Wallet has both ALGO and USDC testnet tokens!
                    </div>
                  </div>
                ) : resultData ? (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2 text-slate-300 text-xs">
                    <div>
                      <span className="font-bold text-slate-400">Location:</span> {resultData.data.location}
                    </div>
                    <div>
                      <span className="font-bold text-slate-400">Temperature:</span> {resultData.data.temperature}
                    </div>
                    <div>
                      <span className="font-bold text-slate-400">Condition:</span> {resultData.data.condition}
                    </div>
                    <div className="italic text-slate-400 pt-1">
                      "{resultData.data.forecast}"
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Right Column: Transaction ID & Link */}
              {txId && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    🔗 On-Chain Settlement Proof
                  </h3>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Transaction ID</div>
                      <div className="text-xs font-mono text-slate-300 break-all select-all">{txId}</div>
                    </div>
                    <a
                      href={`https://lora.algokit.io/testnet/transaction/${txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      🌐 View on Algorand Explorer &rarr;
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default X402DemoPage;
