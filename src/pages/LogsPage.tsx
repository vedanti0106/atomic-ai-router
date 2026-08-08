import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'x402';
  taskId?: string;
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

const mockLogs: LogEntry[] = [
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
    message: 'HTTP 402 Payment Required returned to Router',
    metadata: { challengeAmount: '3.00 USDC', nonce: '8f0a1c93', payTo: 'ALGO_FLIGHT_W481' }
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
    id: 'log_9896',
    timestamp: '16:02:12.450',
    level: 'x402',
    taskId: 'task_77a11e',
    source: 'Payment Module',
    message: 'Atomic rollback completed: refund transaction issued for task_77a11e',
    metadata: { refundTxId: 'REFUND_TX_1102A', refundedAmount: '6.00 USDC' }
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
              className={`px-4 py-2.5 rounded-full text-[13px] font-bold transition-colors flex items-center gap-2 ${
                isLiveStreaming 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isLiveStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{isLiveStreaming ? 'Live Stream Active' : 'Stream Paused'}</span>
            </button>

            <button 
              onClick={() => alert('Exporting log records to JSON format...')}
              className="px-4 py-2.5 bg-sky text-blue-brand rounded-full text-[13px] font-bold hover:bg-blue-brand hover:text-white transition-colors"
            >
              Export Logs
            </button>
          </div>
        </div>

        {/* Level Filters & Search */}
        <div className="bg-white rounded-[24px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Level Tabs - scrollable on mobile */}
            <div className="flex items-center gap-1 p-1.5 bg-slate-100/80 rounded-[14px] overflow-x-auto flex-shrink-0">
              {['ALL', 'x402', 'INFO', 'WARN', 'ERROR'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterLevel(tab)}
                  className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                    filterLevel === tab 
                      ? 'bg-white text-navy shadow-sm' 
                      : 'text-slate-500 hover:text-navy'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:min-w-[280px]">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search log text, Task ID or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-line rounded-[12px] text-[13px] text-ink focus:outline-none focus:border-blue-brand transition-colors"
              />
            </div>

          </div>
        </div>

        {/* Audit Log Terminal Feed */}
        <div className="bg-white rounded-[24px] border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] overflow-hidden">
          <div className="p-5 border-b border-line bg-slate-900 text-slate-300 flex justify-between items-center">
            <div className="flex items-center gap-2 font-mono text-[13px]">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="ml-2 text-slate-400 font-sans text-[12px]">router-audit-stream.log</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">{filteredLogs.length} events logged</span>
          </div>

          <div className="divide-y divide-line">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;

              return (
                <div key={log.id} className="hover:bg-slate-50/70 transition-colors">
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
                      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider shrink-0 ${
                        log.level === 'x402' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        log.level === 'INFO' ? 'bg-sky text-blue-brand' :
                        log.level === 'WARN' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {log.level}
                      </span>

                      {/* Source */}
                      <span className="text-[12.5px] font-bold text-navy shrink-0 bg-slate-100 px-2 py-0.5 rounded-md">
                        {log.source}
                      </span>

                      {/* Message */}
                      <span className="text-[13.5px] font-medium text-slate-700 truncate">
                        {log.message}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                      {log.taskId && (
                        <span className="font-mono text-[11px] text-blue-brand bg-sky/60 px-2 py-0.5 rounded-md font-semibold">
                          {log.taskId}
                        </span>
                      )}
                      <span className="text-slate-400 text-xs">{isExpanded ? '▲ Hide' : '▼ Details'}</span>
                    </div>
                  </div>

                  {/* Expanded Metadata Viewer */}
                  {isExpanded && log.metadata && (
                    <div className="px-6 pb-4 pt-1 bg-slate-900 text-slate-100 text-[12px] font-mono border-t border-slate-800">
                      <div className="text-[11px] text-slate-400 mb-1 font-sans font-semibold uppercase tracking-wider">Event Metadata JSON:</div>
                      <pre className="p-3 bg-slate-950 rounded-[10px] overflow-x-auto leading-relaxed text-blue-300">
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
