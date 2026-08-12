import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { 
  Settings, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Save, 
  CheckCircle2, 
  Coins, 
  Terminal,
  Cpu
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'wallet' | 'x402' | 'endpoints' | 'escrow'>('general');
  
  // Settings Form State
  const [routerName, setRouterName] = useState('Atomic Multi-Agent Service Router');
  const [executionTimeout, setExecutionTimeout] = useState('10');
  const [smartRouting, setSmartRouting] = useState(true);
  const [walletAddress, setWalletAddress] = useState('ALGO_ROUTER_MAIN_W9812A4789X012');
  const [algorandNetwork, setAlgorandNetwork] = useState('TestNet');
  const [usdcAssetId, setUsdcAssetId] = useState('10458941');
  const [autoRollback, setAutoRollback] = useState(true);
  const [nonceExpiry, setNonceExpiry] = useState('300');
  const [maxPaymentCap, setMaxPaymentCap] = useState('20.00');
  const [facilitatorUrl, setFacilitatorUrl] = useState('http://localhost:3002/facilitator');
  const [algonodeUrl, setAlgonodeUrl] = useState('https://testnet-api.algonode.cloud');
  // Escrow settings
  const [escrowAppId, setEscrowAppId] = useState('741209831');
  const [adminAddress, setAdminAddress] = useState('ALGO_ROUTER_MAIN_W9812A4789X012');
  const [facilitatorAddress, setFacilitatorAddress] = useState('ALGO_FACILITATOR_W112...3Z');
  const [deadlineRounds, setDeadlineRounds] = useState('300');
  const [autoRefundEnabled, setAutoRefundEnabled] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">Settings & System Configuration</h1>
            <p className="text-[14px] md:text-[15px] text-slate-500 mt-1 max-w-[650px]">
              Manage Algorand wallet settings, x402 protocol limits, automatic rollback policies, and Facilitator endpoints.
            </p>
          </div>
          {savedSuccess && (
            <div className="px-4 py-2.5 bg-[#E3FBF5] text-[#0E7D69] border border-emerald-200 font-bold text-[13px] rounded-full flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Router Version</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[26px] font-bold font-display text-navy">v1.4.0 Active</div>
            <div className="text-[12px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Smart Parallel Routing ON</span>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-cyan-400 hover:bg-gradient-to-br hover:from-white hover:to-cyan-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Ledger Network</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-600 border border-cyan-200 flex items-center justify-center shadow-xs">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[26px] font-bold font-display text-navy">{algorandNetwork}</div>
            <div className="text-[12px] text-blue-brand font-semibold mt-1">USDC ASA {usdcAssetId}</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-400 hover:bg-gradient-to-br hover:from-white hover:to-amber-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Escrow Contract</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shadow-xs">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[26px] font-bold font-display text-navy">App #{escrowAppId}</div>
            <div className="text-[12px] text-amber-700 font-semibold mt-1">{deadlineRounds} Rounds Deadline</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-400 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">x402 Security Cap</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[26px] font-bold font-display text-navy">${maxPaymentCap} USDC</div>
            <div className="text-[12px] text-emerald-600 font-semibold mt-1">Auto-Rollback Enabled</div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          
          {/* Navigation Tabs - horizontal scroll on mobile, vertical on desktop */}
          <div className="bg-white rounded-[24px] p-3 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover:border-blue-300 transition-all duration-300 h-fit">
            <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {[
              { id: 'general', label: 'General & Router', icon: <Settings className="w-4 h-4" /> },
              { id: 'wallet', label: 'Wallet', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'x402', label: 'x402 Protocol', icon: <ShieldCheck className="w-4 h-4" /> },
              { id: 'escrow', label: 'Escrow Contract', icon: <Lock className="w-4 h-4" /> },
              { id: 'endpoints', label: 'API Endpoints', icon: <Globe className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-3.5 lg:px-4 py-3 rounded-[14px] text-[13px] font-bold transition-all text-left whitespace-nowrap cursor-pointer flex-shrink-0 lg:flex-shrink ${
                  activeTab === tab.id 
                    ? 'bg-blue-brand text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-brand'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

          {/* Right Configuration Form */}
          <form onSubmit={handleSave} className="bg-white rounded-[24px] p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover:border-blue-300 transition-all duration-300">
            
            {/* Tab 1: General */}
            {activeTab === 'general' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-[18px] font-bold text-navy mb-1">Router General Settings</h3>
                  <p className="text-[13px] text-slate-500">Configure public instance identity and default agent execution policies.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-navy">Router Instance Name</label>
                  <input
                    type="text"
                    value={routerName}
                    onChange={(e) => setRouterName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-navy">Max Request Execution Timeout (Seconds)</label>
                  <input
                    type="number"
                    value={executionTimeout}
                    onChange={(e) => setExecutionTimeout(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-navy">Smart Agent Routing</div>
                    <div className="text-[12.5px] text-slate-500">Automatically select agents based on latency, price, and reputation score.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smartRouting}
                    onChange={(e) => setSmartRouting(e.target.checked)}
                    className="w-5 h-5 accent-blue-brand rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Algorand Wallet */}
            {activeTab === 'wallet' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-[18px] font-bold text-navy mb-1">Algorand Wallet & ASA Tokens</h3>
                  <p className="text-[13px] text-slate-500">Manage payment keys and native stablecoin settlement on Algorand.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-navy">Router Public Wallet Address</label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] font-mono text-[13px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-navy">Algorand Network</label>
                    <select
                      value={algorandNetwork}
                      onChange={(e) => setAlgorandNetwork(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-ink focus:outline-none focus:border-blue-brand shadow-xs cursor-pointer transition-colors hover:border-slate-300"
                    >
                      <option value="TestNet">TestNet (Recommended for Hackathon)</option>
                      <option value="MainNet">MainNet (Production)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-navy">USDC ASA Asset ID</label>
                    <input
                      type="text"
                      value={usdcAssetId}
                      onChange={(e) => setUsdcAssetId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] font-mono text-[13px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50/80 rounded-[16px] border border-blue-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13.5px] font-bold text-navy">TestNet Faucet Helper</div>
                      <div className="text-[12px] text-slate-500">Need test funds for demonstration? Request ALGO and testnet USDC instantly.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Requested 10 ALGO from TestNet Faucet! Balance updated.')}
                    className="px-4 py-2 bg-blue-brand text-white font-bold text-[12.5px] rounded-full hover:bg-blue-dark transition-all cursor-pointer shadow-xs shrink-0"
                  >
                    Request Faucet
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: x402 Protocol */}
            {activeTab === 'x402' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-[18px] font-bold text-navy mb-1">x402 Protocol & Atomicity Rules</h3>
                  <p className="text-[13px] text-slate-500">Configure HTTP 402 challenge parameters and all-or-nothing rollback behavior.</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-navy">Automatic Atomic Rollback</div>
                    <div className="text-[12.5px] text-slate-500">If any required sub-agent fails, automatically issue refunds for prior completed calls.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRollback}
                    onChange={(e) => setAutoRollback(e.target.checked)}
                    className="w-5 h-5 accent-blue-brand rounded cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-navy">Nonce TTL / Expiry (Seconds)</label>
                    <input
                      type="number"
                      value={nonceExpiry}
                      onChange={(e) => setNonceExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-navy">Max Micro-Payment Cap ($ USDC)</label>
                    <input
                      type="text"
                      value={maxPaymentCap}
                      onChange={(e) => setMaxPaymentCap(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Escrow Contract */}
            {activeTab === 'escrow' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-[18px] font-bold text-navy mb-1">Trustless Escrow Smart Contract</h3>
                  <p className="text-[13px] text-slate-500">Configure the Algorand escrow application that holds task funds until delivery is proven on-chain.</p>
                </div>

                <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-[16px] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[13.5px] font-bold text-amber-900">Escrow Contract Active</div>
                    <div className="text-[12px] text-amber-800 mt-0.5">App ID {escrowAppId} — deployed on Algorand {algorandNetwork}. Box Storage per task. USDC ASA {usdcAssetId}.</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-navy">Escrow App ID</label>
                  <input
                    type="text"
                    value={escrowAppId}
                    onChange={(e) => setEscrowAppId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] font-mono text-[13px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                    placeholder="Deploy with: python escrow_contract.py deploy"
                  />
                  <p className="text-[11.5px] text-slate-400">Deploy <code className="bg-slate-100 px-1 rounded">server/src/contracts/escrow_contract.py</code> once — reused for all tasks via Box Storage.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-navy">Admin / Dispute Resolver Address</label>
                    <input
                      type="text"
                      value={adminAddress}
                      onChange={(e) => setAdminAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] font-mono text-[12px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                    />
                    <p className="text-[11px] text-slate-400">Only this address can call <code className="bg-slate-100 px-1 rounded">resolve_dispute()</code>.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-navy">Facilitator Address</label>
                    <input
                      type="text"
                      value={facilitatorAddress}
                      onChange={(e) => setFacilitatorAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] font-mono text-[12px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                    />
                    <p className="text-[11px] text-slate-400">Only this address can call <code className="bg-slate-100 px-1 rounded">release_escrow()</code>.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-navy">Default Deadline (Algorand Rounds)</label>
                  <input
                    type="number"
                    value={deadlineRounds}
                    onChange={(e) => setDeadlineRounds(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                  />
                  <p className="text-[11.5px] text-slate-400">300 rounds ≈ 20 minutes on Algorand TestNet (~4s per round). After this, <code className="bg-slate-100 px-1 rounded">refund_escrow()</code> becomes callable by anyone.</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-navy">Auto-Refund Watcher</div>
                    <div className="text-[12.5px] text-slate-500">Automatically poll <code className="bg-slate-100 px-1 rounded text-[11px]">GET /api/escrow/expired</code> and trigger refunds for overdue escrows.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRefundEnabled}
                    onChange={(e) => setAutoRefundEnabled(e.target.checked)}
                    className="w-5 h-5 accent-blue-brand rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-slate-900 rounded-[16px] font-mono text-[12px] text-slate-400 border border-slate-800 shadow-sm">
                  <div className="text-slate-200 font-bold mb-2 font-sans text-[12.5px] flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-blue-400" /> Deploy Command
                  </div>
                  <div className="text-emerald-400">$ cd server/src/contracts</div>
                  <div className="text-slate-300">$ pip install beaker-pyteal pyteal py-algorand-sdk</div>
                  <div className="text-slate-300">$ ROUTER_MNEMONIC="..." python escrow_contract.py deploy</div>
                  <div className="text-amber-400 mt-1"># → Copy App ID above and set ESCROW_APP_ID env var</div>
                </div>
              </div>
            )}

            {/* Tab 5: API Endpoints */}
            {activeTab === 'endpoints' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-[18px] font-bold text-navy mb-1">Service & Node Endpoints</h3>
                  <p className="text-[13px] text-slate-500">Configure connection strings for the Facilitator micro-service and Algorand RPC nodes.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-navy">x402 Facilitator Service URL</label>
                  <input
                    type="text"
                    value={facilitatorUrl}
                    onChange={(e) => setFacilitatorUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] font-mono text-[13px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-navy">Algorand Node Endpoint (Algonode)</label>
                  <input
                    type="text"
                    value={algonodeUrl}
                    onChange={(e) => setAlgonodeUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] font-mono text-[13px] text-ink focus:outline-none focus:border-blue-brand shadow-xs transition-colors hover:border-slate-300"
                  />
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-brand hover:bg-blue-dark text-white rounded-full text-[14px] font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;


