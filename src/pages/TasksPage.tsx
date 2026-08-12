import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { 
  ListChecks, 
  Cpu, 
  ShieldCheck, 
  RotateCcw, 
  Search, 
  Zap, 
  Plane, 
  Hotel, 
  Sun, 
  CreditCard, 
  Tag, 
  Ticket, 
  Stethoscope, 
  Pill, 
  FileText, 
  SearchCode, 
  ClipboardList, 
  BarChart3, 
  Globe, 
  FileEdit,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';

type EscrowStatus = 'FUNDED' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';

interface AgentCall {
  name: string;
  icon: React.ReactNode;
  price: string;
  status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'ROLLED_BACK';
  txId?: string;
  latency: string;
  escrowStatus?: EscrowStatus;
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
  escrowStatus?: EscrowStatus;
  escrowAppId?: number;
  escrowDeadlineRound?: number;
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
    escrowStatus: 'RELEASED',
    escrowAppId: 741209831,
    agents: [
      { name: 'Flight AI', icon: <Plane className="w-3.5 h-3.5" />, price: '3.00', status: 'COMPLETED', txId: 'ALGO_TX_8921A', latency: '620ms', escrowStatus: 'RELEASED' },
      { name: 'Hotel AI', icon: <Hotel className="w-3.5 h-3.5" />, price: '2.50', status: 'COMPLETED', txId: 'ALGO_TX_8921B', latency: '890ms', escrowStatus: 'RELEASED' },
      { name: 'Weather AI', icon: <Sun className="w-3.5 h-3.5" />, price: '0.50', status: 'COMPLETED', txId: 'ALGO_TX_8921C', latency: '210ms', escrowStatus: 'RELEASED' },
      { name: 'Finance AI', icon: <CreditCard className="w-3.5 h-3.5" />, price: '1.00', status: 'COMPLETED', txId: 'ALGO_TX_8921D', latency: '450ms', escrowStatus: 'RELEASED' },
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
    escrowStatus: 'FUNDED',
    escrowAppId: 741209831,
    escrowDeadlineRound: 47312637,
    agents: [
      { name: 'Price Scraper AI', icon: <Tag className="w-3.5 h-3.5" />, price: '1.50', status: 'COMPLETED', txId: 'ALGO_TX_9012A', latency: '540ms', escrowStatus: 'FUNDED' },
      { name: 'Discount Finder AI', icon: <Ticket className="w-3.5 h-3.5" />, price: '1.00', status: 'RUNNING', latency: '310ms', escrowStatus: 'FUNDED' },
      { name: 'Finance AI', icon: <CreditCard className="w-3.5 h-3.5" />, price: '0.00', status: 'RUNNING', latency: '0ms' }
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
    escrowStatus: 'REFUNDED',
    escrowAppId: 741209831,
    agents: [
      { name: 'Symptom Checker AI', icon: <Stethoscope className="w-3.5 h-3.5" />, price: '4.00', status: 'ROLLED_BACK', txId: 'REFUND_TX_1102A', latency: '710ms', escrowStatus: 'REFUNDED' },
      { name: 'Pharmacy Stock AI', icon: <Pill className="w-3.5 h-3.5" />, price: '2.00', status: 'ROLLED_BACK', txId: 'REFUND_TX_1102B', latency: '430ms', escrowStatus: 'REFUNDED' },
      { name: 'Insurance Verify AI', icon: <ShieldCheck className="w-3.5 h-3.5" />, price: '5.00', status: 'FAILED', latency: 'timeout' }
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
    escrowStatus: 'RELEASED',
    escrowAppId: 741209831,
    agents: [
      { name: 'OCR Reader AI', icon: <FileText className="w-3.5 h-3.5" />, price: '5.00', status: 'COMPLETED', txId: 'ALGO_TX_7841A', latency: '1.2s', escrowStatus: 'RELEASED' },
      { name: 'Fraud Check AI', icon: <SearchCode className="w-3.5 h-3.5" />, price: '4.00', status: 'COMPLETED', txId: 'ALGO_TX_7841B', latency: '980ms', escrowStatus: 'RELEASED' },
      { name: 'Policy Rules AI', icon: <ClipboardList className="w-3.5 h-3.5" />, price: '3.00', status: 'COMPLETED', txId: 'ALGO_TX_7841C', latency: '650ms', escrowStatus: 'RELEASED' }
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
    escrowStatus: 'RELEASED',
    escrowAppId: 741209831,
    agents: [
      { name: 'Sentiment AI', icon: <BarChart3 className="w-3.5 h-3.5" />, price: '1.00', status: 'COMPLETED', txId: 'ALGO_TX_6512A', latency: '320ms', escrowStatus: 'RELEASED' },
      { name: 'Translation AI', icon: <Globe className="w-3.5 h-3.5" />, price: '1.50', status: 'COMPLETED', txId: 'ALGO_TX_6512B', latency: '810ms', escrowStatus: 'RELEASED' },
      { name: 'Reply Draft AI', icon: <FileEdit className="w-3.5 h-3.5" />, price: '1.00', status: 'COMPLETED', txId: 'ALGO_TX_6512C', latency: '540ms', escrowStatus: 'RELEASED' }
    ]
  }
];

const TasksPage: React.FC = () => {
  const { showInfo, showSuccess } = useToast();
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
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">Tasks & Workflow Tracker</h1>
            <p className="text-[14px] md:text-[15px] text-slate-500 mt-1">
              Track multi-agent orchestration, monitor live sub-agent status, and inspect x402 atomic rollback transactions.
            </p>
          </div>
          <button 
            onClick={() => showInfo('Simulating new multi-agent atomic request execution...')}
            className="self-start px-5 py-3 bg-blue-brand hover:bg-blue-dark text-white rounded-full text-[14px] font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Simulate New Task</span>
          </button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Total Tasks Run</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs">
                <ListChecks className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">1,482</div>
            <div className="text-[12px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>↑ 18% from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-cyan-400 hover:bg-gradient-to-br hover:from-white hover:to-cyan-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Active Executions</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-600 border border-cyan-200 flex items-center justify-center shadow-xs">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">4 Active</div>
            <div className="text-[12px] text-blue-brand font-semibold mt-1">Real-time parallel routing</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-400 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Atomicity Success Rate</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">99.8%</div>
            <div className="text-[12px] text-slate-500 font-medium mt-1">Zero partial payments lost</div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-400 hover:bg-gradient-to-br hover:from-white hover:to-amber-50/20 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-slate-500">Atomic Rollbacks</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center shadow-xs">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold font-display text-navy">3 Refunded</div>
            <div className="text-[12px] text-amber-600 font-semibold mt-1">100% money returned on error</div>
          </div>

        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover:border-indigo-300 transition-all duration-300 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-[14px] w-full sm:w-auto border border-slate-200/60">
              {['ALL', 'SUCCESS', 'IN_PROGRESS', 'ROLLED_BACK', 'FAILED'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all cursor-pointer ${
                    filterStatus === tab 
                      ? 'bg-blue-brand text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-white hover:text-navy'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Task ID, Goal or User..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[12px] text-[13px] text-ink focus:outline-none focus:border-blue-brand transition-colors shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover:border-blue-300 transition-all duration-300 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-[16px] font-bold text-navy">Task Executions ({filteredTasks.length})</h3>
            <span className="text-[12px] font-medium text-slate-400">Auto-refreshing every 5s</span>
          </div>

          <div className="overflow-x-auto -mx-0">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="py-3.5 px-4 md:px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Task ID</th>
                  <th className="py-3.5 px-4 md:px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Request Goal</th>
                  <th className="py-3.5 px-4 md:px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Agents</th>
                  <th className="py-3.5 px-4 md:px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Cost</th>
                  <th className="py-3.5 px-4 md:px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 md:px-6 text-[12px] font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-blue-50/40 hover:border-l-4 hover:border-blue-500 transition-all cursor-pointer">
                    <td className="py-4 px-6 font-mono text-[13px] font-bold text-blue-brand">
                      {t.id}
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">{t.createdAt}</div>
                    </td>
                    <td className="py-4 px-6 max-w-[340px]">
                      <div className="text-[13.5px] font-bold text-navy line-clamp-2 leading-snug">{t.goal}</div>
                      <div className="text-[11px] text-slate-400 mt-1">User: {t.userId} • Time: {t.executionTime}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {t.agents.map((ag, idx) => (
                          <span 
                            key={idx}
                            title={`${ag.name} (${ag.status})`}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              ag.status === 'COMPLETED' ? 'bg-[#E3FBF5] text-[#0E7D69] border border-emerald-200' :
                              ag.status === 'RUNNING' ? 'bg-amber-400 text-amber-950 border border-amber-300 shadow-xs animate-pulse' :
                              ag.status === 'ROLLED_BACK' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              'bg-rose-50 text-rose-700 border border-rose-200'
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
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                          t.status === 'SUCCESS' ? 'bg-[#E3FBF5] text-[#0E7D69] border border-emerald-200' :
                          t.status === 'IN_PROGRESS' ? 'bg-amber-400 text-amber-950 border border-amber-300 shadow-xs animate-pulse' :
                          t.status === 'ROLLED_BACK' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {t.status.replace('_', ' ')}
                        </span>
                        {t.escrowStatus && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                            t.escrowStatus === 'RELEASED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            t.escrowStatus === 'REFUNDED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            t.escrowStatus === 'FUNDED'   ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {t.escrowStatus === 'RELEASED' ? '✅' : t.escrowStatus === 'REFUNDED' ? '↩' : t.escrowStatus === 'FUNDED' ? '🔒' : '⚠'}
                            {' '}Escrow {t.escrowStatus}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedTask(t)}
                        className="px-3 py-1.5 border border-slate-200 rounded-[10px] text-[12.5px] font-bold text-navy hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer shadow-xs"
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
          <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="bg-white rounded-t-[24px] sm:rounded-[24px] max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 md:p-7 shadow-2xl border border-slate-200/90 animate-in fade-in slide-in-from-bottom-2 duration-200">
              
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Task Inspector</span>
                    <span className="font-mono text-[13px] font-bold text-blue-brand bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">{selectedTask.id}</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-navy">{selectedTask.goal}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-navy hover:bg-slate-200 text-sm font-bold cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Atomicity Banner */}
              {selectedTask.status === 'ROLLED_BACK' && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[16px] text-[13px] text-amber-900">
                  <div className="font-bold flex items-center gap-2 mb-1 text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Atomic Rollback Triggered (Outcome B)</span>
                  </div>
                  One downstream agent failed. Per the x402 atomic guarantee, all previous agent payments were automatically refunded to the user wallet on Algorand. Zero money was lost.
                </div>
              )}

              {selectedTask.status === 'SUCCESS' && (
                <div className="mb-6 p-4 bg-[#E3FBF5] border border-emerald-200 rounded-[16px] text-[13px] text-[#0E7D69]">
                  <div className="font-bold flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Atomic Execution Verified (Outcome A)</span>
                  </div>
                  All sub-agent API challenges passed, micro-payments settled on Algorand, and final combined output was delivered atomically.
                </div>
              )}

              {/* Escrow Status Panel */}
              {selectedTask.escrowStatus && (
                <div className={`mb-6 p-4 rounded-[16px] border text-[13px] ${
                  selectedTask.escrowStatus === 'RELEASED' ? 'bg-[#E3FBF5] border-emerald-200 text-[#0E7D69]' :
                  selectedTask.escrowStatus === 'REFUNDED' ? 'bg-blue-50 border-blue-200 text-blue-900' :
                  selectedTask.escrowStatus === 'FUNDED'   ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="font-bold flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4" />
                    <span>Escrow Contract — {selectedTask.escrowStatus}</span>
                    {selectedTask.escrowAppId && (
                      <span className="ml-auto font-mono text-[11px] opacity-70">App ID {selectedTask.escrowAppId}</span>
                    )}
                  </div>
                  <div className="text-[12px] opacity-80 leading-relaxed">
                    {selectedTask.escrowStatus === 'FUNDED'   && `Funds are locked in the smart contract (App ID ${selectedTask.escrowAppId}). Deadline round: ${selectedTask.escrowDeadlineRound?.toLocaleString() ?? 'N/A'}. Auto-refund will fire if agent doesn't deliver.`}
                    {selectedTask.escrowStatus === 'RELEASED' && 'Funds were released to the agent after delivery proof was verified by the Facilitator and stored on-chain.'}
                    {selectedTask.escrowStatus === 'REFUNDED' && 'Deadline passed without delivery — funds were automatically returned to the payer by the permissionless refund_escrow() call.'}
                    {selectedTask.escrowStatus === 'DISPUTED' && 'Escrow is frozen pending admin arbitration. Admin can release to agent or refund payer via resolve_dispute().'}
                  </div>
                </div>
              )}

              {/* Sub-Agents Breakdown */}
              <h4 className="text-[14px] font-bold text-navy mb-4">Execution Sequence & x402 Payments</h4>
              <div className="flex flex-col gap-3 mb-6">
                {selectedTask.agents.map((ag, index) => (
                  <div key={index} className="p-4 bg-slate-50/80 rounded-[16px] border border-slate-200/80 flex items-center justify-between gap-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-blue-brand shadow-xs border border-slate-200/60">
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
                          <ExternalLink className="w-3 h-3" />
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
              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-200">
                {selectedTask.escrowStatus === 'FUNDED' && (
                  <>
                    <button
                      onClick={() => alert(`Triggering escrow refund for ${selectedTask.id}…\nPOST /api/escrow/refund`)}
                      className="px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 font-bold rounded-full text-[12px] hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      ↩ Trigger Refund
                    </button>
                    <button
                      onClick={() => alert(`Raising dispute for ${selectedTask.id}…\nPOST /api/escrow/dispute`)}
                      className="px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-full text-[12px] hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      ⚠ Raise Dispute
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-full text-[13px] hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => showSuccess(`Fetching official x402 receipt for ${selectedTask.id}...`)}
                  className="px-5 py-2.5 bg-blue-brand text-white font-bold rounded-full text-[13px] hover:bg-blue-dark transition-colors shadow-sm cursor-pointer"
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

