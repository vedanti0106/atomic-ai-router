import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { 
  Radio, 
  Download, 
  Search, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  FileJson,
  FileText,
  Lock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'x402' | 'ESCROW';
  taskId?: string;
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

const mockLogs: LogEntry[] = [
  {
    id: 'log_9906',
    timestamp: '16:15:44.820',
    level: 'ESCROW',
    taskId: 'task_9f31ab',
    source: 'EscrowService',
    message: 'Escrow RELEASED — 7.00 USDC sent to agent Flight AI',
    metadata: {
      txId: 'TX_ALG_REL_9921B',
      confirmedRound: 47312402,
      agentAddress: 'ALGO_FLIGHT_W481...9X',
      proofHash: 'a3f8c2d9e1b04712...6f2a',
      amountUsdc: 7.00
    }
  },
  {
    id: 'log_9905',
    timestamp: '16:15:44.512',
    level: 'ESCROW',
    taskId: 'task_9f31ab',
    source: 'EscrowService',
    message: 'release_escrow() called — delivery proof hash stored on-chain',
    metadata: {
      appId: 741209831,
      boxKey: 'task_9f31ab',
      proofHash: 'a3f8c2d9e1b04712...6f2a',
      facilitatorAddress: 'ALGO_FACILITATOR_W112...3Z'
    }
  },
  {
    id: 'log_9904',
    timestamp: '16:15:43.100',
    level: 'ESCROW',
    taskId: 'task_9f31ab',
    source: 'EscrowService',
    message: 'Escrow FUNDED — 7.00 USDC locked in contract, deadline round 47312700',
    metadata: {
      txId: 'TX_ALG_99201A843F',
      appId: 741209831,
      boxKey: 'task_9f31ab',
      deadlineRound: 47312700,
      amountUsdc: 7.00,
      payerAddress: 'ALGO_ROUTER_MAIN_W9812A4789X012'
    }
  },
  {
    id: 'log_9901',
    timestamp: '16:15:44.210',
    level: 'x402',
    taskId: 'task_9f31ab',
    source: 'Payment Module',
    message: 'x402 payment challenge verified and settled on-chain',
    metadata: {
      txId: 'ALGO_TX_8921A',
      amount: '3.00 USDC',
      nonce: '8f0a1c93',
      agent: 'Flight AI',
      facilitatorLatency: '410ms'
    }
  },
  {
    id: 'log_9900',
    timestamp: '16:15:43.801',
    level: 'INFO',
    taskId: 'task_9f31ab',
    source: 'Router Service',
    message: 'Calling agent Flight AI (POST /search-flights)',
    metadata: { endpoint: 'http://localhost:3001/search', mode: 'smart_routing' }
  },
  {
    id: 'log_9899',
    timestamp: '16:15:43.600',
    level: 'x402',
    taskId: 'task_9f31ab',
    source: 'Flight AI',
    message: 'HTTP 402 Payment Required returned to Router — payTo: Escrow App',
    metadata: { challengeAmount: '3.00 USDC', nonce: '8f0a1c93', payTo: 'ESCROW_APP_741209831' }
  },
  {
    id: 'log_9898',
    timestamp: '16:15:42.110',
    level: 'INFO',
    taskId: 'task_9f31ab',
    source: 'Router Service',
    message: 'Received new multi-agent request from user_8231',
    metadata: { goal: 'Plan a 3-day trip to Goa under ₹20,000', agentsNeeded: ['Flight AI', 'Hotel AI', 'Weather AI'] }
  },
  {
    id: 'log_9897',
    timestamp: '16:02:11.902',
    level: 'WARN',
    taskId: 'task_77a11e',
    source: 'Insurance Verify AI',
    message: 'Agent response timeout (5000ms exceeded). Initiating atomic rollback.',
    metadata: { timeout: true, status: 504 }
  },
  {
    id: 'log_9903',
    timestamp: '16:02:13.110',
    level: 'ESCROW',
    taskId: 'task_77a11e',
    source: 'EscrowService',
    message: 'Auto-refund triggered — deadline round 47312130 passed at round 47312451',
    metadata: {
      currentRound: 47312451,
      deadlineRound: 47312130,
      payerAddress: 'ALGO_ROUTER_MAIN_W9812A4789X012',
      amountUsdc: 6.00
    }
  },
  {
    id: 'log_9896',
    timestamp: '16:02:13.850',
    level: 'ESCROW',
    taskId: 'task_77a11e',
    source: 'EscrowService',
    message: 'Escrow REFUNDED — 6.00 USDC returned to payer. TxID REFUND_TX_1102A',
    metadata: {
      txId: 'REFUND_TX_1102A',
      confirmedRound: 47312453,
      payerAddress: 'ALGO_ROUTER_MAIN_W9812A4789X012',
      refundedAmount: '6.00 USDC'
    }
  },
  {
    id: 'log_9902',
    timestamp: '15:55:30.041',
    level: 'ESCROW',
    taskId: 'task_disp_01',
    source: 'EscrowService',
    message: 'Dispute RAISED for task_disp_01 — funds frozen pending admin resolution',
    metadata: {
      escrowId: 'escrow_task_disp_01',
      appId: 741209831,
      status: 'DISPUTED',
      payerAddress: 'ALGO_ROUTER_MAIN_W9812A4789X012',
      amountUsdc: 8.50
    }
  },
  {
    id: 'log_9895',
    timestamp: '15:45:00.012',
    level: 'ERROR',
    source: 'Facilitator Node',
    message: 'Algorand node RPC endpoint temporarily unreachable, retried via fallback node',
    metadata: { primaryNode: 'testnet-api.algonode.cloud', fallbackNode: 'testnet-idx.algonode.cloud' }
  }
];

const LogsPage: React.FC = () => {
  const { showInfo } = useToast();
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  const filteredLogs = mockLogs.filter(l => {
    const matchesLevel = filterLevel === 'ALL' || l.level === filterLevel;
    const matchesSearch = l.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (l.taskId && l.taskId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const totalCount = mockLogs.length;
  const escrowCount = mockLogs.filter(l => l.level === 'ESCROW').length;
  const x402Count = mockLogs.filter(l => l.level === 'x402').length;
  const errorCount = mockLogs.filter(l => l.level === 'ERROR' || l.level === 'WARN').length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">System & Audit Logs</h1>
            <p className="text-[14px] md:text-[15px] text-slate-500 mt-1">
              Append-only real-time event log for transparent debugging, x402 challenge verification, and live demo auditability.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-4 py-2.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                isLiveStreaming 
                  ? 'bg-[#E3FBF5] text-[#0E7D69] border border-emerald-200' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <Radio className={`w-4 h-4 ${isLiveStreaming ? 'text-[#0E7D69] animate-pulse' : 'text-slate-400'}`} />
              <span>{isLiveStreaming ? 'Live Stream Active' : 'Stream Paused'}</span>
            </button>

            <button 
              onClick={() => showInfo('Exporting log records to JSON format...')}
              className="px-4 py-2.5 bg-blue-brand hover:bg-blue-dark text-white rounded-full text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Total Audit Events</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">{totalCount} Logs</div>
            <div className="text-[12px] text-emerald-600 font-semibold mt-1">Real-time append stream</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-400 hover:bg-gradient-to-br hover:from-white hover:to-amber-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Escrow Contract Logs</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shadow-xs">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">{escrowCount} Events</div>
            <div className="text-[12px] text-amber-700 font-semibold mt-1">On-chain state transitions</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-purple-400 hover:bg-gradient-to-br hover:from-white hover:to-purple-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">x402 Protocol Events</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">{x402Count} Events</div>
            <div className="text-[12px] text-purple-700 font-semibold mt-1">Micro-payment challenges</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-rose-400 hover:bg-gradient-to-br hover:from-white hover:to-rose-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Warnings & Errors</span>
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">{errorCount} Logged</div>
            <div className="text-[12px] text-rose-600 font-semibold mt-1">Auto-rollbacks & retries</div>
          </div>

        </div>

        {/* Level Filters & Search */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover:border-indigo-300 transition-all duration-300 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Level Tabs - scrollable on mobile */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-[14px] border border-slate-200/60 overflow-x-auto shrink-0">
              {['ALL', 'ESCROW', 'x402', 'INFO', 'WARN', 'ERROR'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterLevel(tab)}
                  className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    filterLevel === tab 
                      ? 'bg-blue-brand text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-white hover:text-navy'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:min-w-[280px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search log text, Task ID or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[12px] text-[13px] text-ink focus:outline-none focus:border-blue-brand transition-colors shadow-xs"
              />
            </div>

          </div>
        </div>

        {/* Audit Log Terminal Feed */}
        <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover:border-blue-300 transition-all duration-300 overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-slate-900 text-slate-300 flex justify-between items-center">
            <div className="flex items-center gap-2 font-mono text-[13px]">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="ml-2 text-slate-300 font-sans font-bold text-[12.5px] flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-400" /> router-audit-stream.log
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{filteredLogs.length} events logged</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;

              const hoverBgClass = 
                log.level === 'ESCROW' ? 'hover:bg-amber-50/60 hover:border-l-4 hover:border-amber-500' :
                log.level === 'x402' ? 'hover:bg-purple-50/60 hover:border-l-4 hover:border-purple-500' :
                log.level === 'INFO' ? 'hover:bg-blue-50/60 hover:border-l-4 hover:border-blue-500' :
                log.level === 'WARN' ? 'hover:bg-amber-50/60 hover:border-l-4 hover:border-amber-500' :
                'hover:bg-rose-50/60 hover:border-l-4 hover:border-rose-500';

              return (
                <div key={log.id} className={`transition-all ${hoverBgClass}`}>
                  <div 
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                      
                      {/* Timestamp */}
                      <span className="font-mono text-[12px] text-slate-400 shrink-0 pt-0.5 md:pt-0">
                        {log.timestamp}
                      </span>

                      {/* Level Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider shrink-0 border ${
                        log.level === 'ESCROW' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        log.level === 'x402' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        log.level === 'INFO' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        log.level === 'WARN' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {log.level}
                      </span>

                      {/* Source */}
                      <span className="text-[12px] font-bold text-navy shrink-0 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                        {log.source}
                      </span>

                      {/* Message */}
                      <span className="text-[13.5px] font-bold text-navy truncate">
                        {log.message}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                      {log.taskId && (
                        <span className="font-mono text-[11px] font-bold text-blue-brand bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          {log.taskId}
                        </span>
                      )}
                      <span className="text-slate-500 text-xs font-semibold flex items-center gap-1">
                        {isExpanded ? <><ChevronUp className="w-3.5 h-3.5" /> Hide</> : <><ChevronDown className="w-3.5 h-3.5" /> Details</>}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Metadata Viewer */}
                  {isExpanded && log.metadata && (
                    <div className="px-6 pb-4 pt-2 bg-slate-900 text-slate-100 text-[12px] font-mono border-t border-slate-800 animate-in fade-in duration-150">
                      <div className="text-[11px] text-slate-400 mb-1.5 font-sans font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FileJson className="w-3.5 h-3.5 text-blue-400" /> Event Metadata JSON:
                      </div>
                      <pre className="p-3 bg-slate-950 rounded-[12px] overflow-x-auto leading-relaxed text-blue-300 border border-slate-800 shadow-inner">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default LogsPage;


