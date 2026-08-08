import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface AgentCall {
  name: string;
  icon: string;
  price: string;
  status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'ROLLED_BACK';
  txId?: string;
  latency: string;
}

interface TaskItem {
  id: string;
  goal: string;
  userId: string;
  status: 'SUCCESS' | 'IN_PROGRESS' | 'FAILED' | 'ROLLED_BACK';
  createdAt: string;
  totalCost: string;
  currency: string;
  agents: AgentCall[];
  executionTime: string;
}

const mockTasks: TaskItem[] = [
  {
    id: 'task_9f31ab',
    goal: 'Plan a 3-day trip to Goa under ₹20,000 with flights, hotels and weather.',
    userId: 'user_8231',
    status: 'SUCCESS',
    createdAt: '2 mins ago',
    totalCost: '7.00',
    currency: 'USDC',
    executionTime: '4.2s',
    agents: [
      { name: 'Flight AI', icon: '✈', price: '3.00', status: 'COMPLETED', txId: 'ALGO_TX_8921A', latency: '620ms' },
      { name: 'Hotel AI', icon: '🛏', price: '2.50', status: 'COMPLETED', txId: 'ALGO_TX_8921B', latency: '890ms' },
      { name: 'Weather AI', icon: '☀', price: '0.50', status: 'COMPLETED', txId: 'ALGO_TX_8921C', latency: '210ms' },
      { name: 'Finance AI', icon: '💳', price: '1.00', status: 'COMPLETED', txId: 'ALGO_TX_8921D', latency: '450ms' },
    ]
  },
  {
    id: 'task_88c42d',
    goal: 'Compare prices across 5 online stores for Sony WH-1000XM5 headphones.',
    userId: 'user_4412',
    status: 'IN_PROGRESS',
    createdAt: '12 seconds ago',
    totalCost: '2.50',
    currency: 'USDC',
    executionTime: '1.8s',
    agents: [
      { name: 'Price Scraper AI', icon: '🏷', price: '1.50', status: 'COMPLETED', txId: 'ALGO_TX_9012A', latency: '540ms' },
      { name: 'Discount Finder AI', icon: '🎟', price: '1.00', status: 'RUNNING', latency: '310ms' },
      { name: 'Finance AI', icon: '💳', price: '0.00', status: 'RUNNING', latency: '0ms' }
    ]
  },
  {
    id: 'task_77a11e',
    goal: 'Hospital Assistant: Symptom triage, pharmacy check, and insurance verification.',
    userId: 'user_9901',
    status: 'ROLLED_BACK',
    createdAt: '15 mins ago',
    totalCost: '0.00',
    currency: 'USDC',
    executionTime: '2.1s',
    agents: [
      { name: 'Symptom Checker AI', icon: '🩺', price: '4.00', status: 'ROLLED_BACK', txId: 'REFUND_TX_1102A', latency: '710ms' },
      { name: 'Pharmacy Stock AI', icon: '💊', price: '2.00', status: 'ROLLED_BACK', txId: 'REFUND_TX_1102B', latency: '430ms' },
      { name: 'Insurance Verify AI', icon: '🛡', price: '5.00', status: 'FAILED', latency: 'timeout' }
    ]
  },
  {
    id: 'task_65b99f',
    goal: 'Insurance claim audit: Document OCR, anomaly check, policy rule engine.',
    userId: 'user_1029',
    status: 'SUCCESS',
    createdAt: '1 hour ago',
    totalCost: '12.00',
    currency: 'USDC',
    executionTime: '5.6s',
    agents: [
      { name: 'OCR Reader AI', icon: '📄', price: '5.00', status: 'COMPLETED', txId: 'ALGO_TX_7841A', latency: '1.2s' },
      { name: 'Fraud Check AI', icon: '🔍', price: '4.00', status: 'COMPLETED', txId: 'ALGO_TX_7841B', latency: '980ms' },
      { name: 'Policy Rules AI', icon: '📋', price: '3.00', status: 'COMPLETED', txId: 'ALGO_TX_7841C', latency: '650ms' }
    ]
  },
  {
    id: 'task_54d33c',
    goal: 'Automate customer support email response with sentiment analysis & language translation.',
    userId: 'user_6672',
    status: 'SUCCESS',
    createdAt: '3 hours ago',
    totalCost: '3.50',
    currency: 'USDC',
    executionTime: '2.9s',
    agents: [
      { name: 'Sentiment AI', icon: '📊', price: '1.00', status: 'COMPLETED', txId: 'ALGO_TX_6512A', latency: '320ms' },
      { name: 'Translation AI', icon: '🌐', price: '1.50', status: 'COMPLETED', txId: 'ALGO_TX_6512B', latency: '810ms' },
      { name: 'Reply Draft AI', icon: '✍', price: '1.00', status: 'COMPLETED', txId: 'ALGO_TX_6512C', latency: '540ms' }
    ]
  }
];

const TasksPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const filteredTasks = mockTasks.filter(t => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.userId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-[32px] font-bold font-display text-navy leading-tight">Tasks & Workflow Tracker</h1>
            <p className="text-[15px] text-slate-500 mt-1 max-w-[650px]">
              Track multi-agent orchestration, monitor live sub-agent status, and inspect x402 atomic rollback transactions.
            </p>
          </div>
          <button 
            onClick={() => alert('Simulating new multi-agent atomic request execution...')}
            className="self-start md:self-auto px-5 py-3 bg-blue-brand hover:bg-blue-dark text-white rounded-full text-[14px] font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            <span>⚡</span>
            <span>Simulate New Task</span>
          </button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Total Tasks Run</span>
              <span className="w-9 h-9 rounded-full bg-sky flex items-center justify-center text-blue-brand text-lg">📋</span>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">1,482</div>
            <div className="text-[12px] text-emerald-600 font-semibold mt-1">↑ 18% from last week</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Active Executions</span>
              <span className="w-9 h-9 rounded-full bg-sky flex items-center justify-center text-blue-brand text-lg">⚙</span>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">4 Active</div>
            <div className="text-[12px] text-blue-brand font-semibold mt-1">Real-time parallel routing</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Atomicity Success Rate</span>
              <span className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-lg">🛡</span>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">99.8%</div>
            <div className="text-[12px] text-slate-500 font-medium mt-1">Zero partial payments lost</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Atomic Rollbacks</span>
              <span className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 text-lg">↺</span>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">3 Refunded</div>
            <div className="text-[12px] text-amber-600 font-semibold mt-1">100% money returned on error</div>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white rounded-[24px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-[14px]">
              {['ALL', 'SUCCESS', 'IN_PROGRESS', 'ROLLED_BACK', 'FAILED'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-3.5 py-1.5 rounded-[10px] text-[12.5px] font-bold transition-all ${
                    filterStatus === tab 
                      ? 'bg-white text-navy shadow-sm' 
                      : 'text-slate-500 hover:text-navy'
                  }`}
                >
                  {tab === 'ALL' ? 'All Tasks' : tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search Task ID, Goal or User..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-line rounded-[12px] text-[13px] text-ink focus:outline-none focus:border-blue-brand transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-[24px] border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] overflow-hidden">
          <div className="p-6 border-b border-line flex justify-between items-center">
            <h3 className="text-[16px] font-bold text-navy">Task Executions ({filteredTasks.length})</h3>
            <span className="text-[12px] font-medium text-slate-400">Auto-refreshing every 5s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-line">
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Task ID</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Request Goal</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Agents Involved</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Total Cost</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-[13px] font-bold text-blue-brand">
                      {t.id}
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">{t.createdAt}</div>
                    </td>
                    <td className="py-4 px-6 max-w-[340px]">
                      <div className="text-[13.5px] font-medium text-navy line-clamp-2 leading-snug">{t.goal}</div>
                      <div className="text-[11px] text-slate-400 mt-1">User: {t.userId} • Time: {t.executionTime}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {t.agents.map((ag, idx) => (
                          <span 
                            key={idx}
                            title={`${ag.name} (${ag.status})`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              ag.status === 'COMPLETED' ? 'bg-sky text-blue-brand' :
                              ag.status === 'RUNNING' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                              ag.status === 'ROLLED_BACK' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-700'
                            }`}
                          >
                            <span>{ag.icon}</span>
                            <span>{ag.name.replace(' AI', '')}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-display font-bold text-navy text-[14px]">
                      ${t.totalCost} <span className="text-[11px] font-medium text-slate-400">{t.currency}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                        t.status === 'SUCCESS' ? 'bg-[#E3FBF5] text-[#0E7D69]' :
                        t.status === 'IN_PROGRESS' ? 'bg-sky text-blue-brand animate-pulse' :
                        t.status === 'ROLLED_BACK' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedTask(t)}
                        className="px-3 py-1.5 border border-line rounded-[10px] text-[12.5px] font-semibold text-navy hover:bg-slate-100 transition-colors"
                      >
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Detail Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-7 shadow-2xl border border-line animate-in fade-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-line">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Task Inspector</span>
                    <span className="font-mono text-[13px] font-bold text-blue-brand bg-sky px-2 py-0.5 rounded-md">{selectedTask.id}</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-navy">{selectedTask.goal}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-navy hover:bg-slate-200 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Atomicity Banner */}
              {selectedTask.status === 'ROLLED_BACK' && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[16px] text-[13px] text-amber-900">
                  <div className="font-bold flex items-center gap-2 mb-1 text-amber-800">
                    <span>⚠️</span>
                    <span>Atomic Rollback Triggered (Outcome B)</span>
                  </div>
                  One downstream agent failed. Per the x402 atomic guarantee, all previous agent payments were automatically refunded to the user wallet on Algorand. Zero money was lost.
                </div>
              )}

              {selectedTask.status === 'SUCCESS' && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-[16px] text-[13px] text-emerald-900">
                  <div className="font-bold flex items-center gap-2 mb-1 text-emerald-800">
                    <span>✅</span>
                    <span>Atomic Execution Verified (Outcome A)</span>
                  </div>
                  All sub-agent API challenges passed, micro-payments settled on Algorand, and final combined output was delivered atomically.
                </div>
              )}

              {/* Sub-Agents Breakdown */}
              <h4 className="text-[14px] font-bold text-navy mb-4">Execution Sequence & x402 Payments</h4>
              <div className="flex flex-col gap-3 mb-6">
                {selectedTask.agents.map((ag, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-[16px] border border-line flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">
                        {ag.icon}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-navy">{ag.name}</div>
                        <div className="text-[12px] text-slate-500">Latency: {ag.latency}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[13px] font-bold text-navy">${ag.price} USDC</div>
                      {ag.txId ? (
                        <div className="font-mono text-[11px] text-blue-brand flex items-center justify-end gap-1">
                          <span>🔗</span>
                          <span className="truncate max-w-[110px]">{ag.txId}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">No TxID</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-full text-[13px] hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => alert(`Fetching official x402 receipt for ${selectedTask.id}...`)}
                  className="px-5 py-2.5 bg-blue-brand text-white font-bold rounded-full text-[13px] hover:bg-blue-dark transition-colors shadow-sm"
                >
                  Download Receipt
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default TasksPage;
