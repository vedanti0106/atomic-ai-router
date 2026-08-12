import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { Bot, CheckCircle2, Zap, TrendingUp, RefreshCw, Eye, Plane, Hotel, Sun, CreditCard, MapPin } from 'lucide-react';

const metrics = [
  { label: 'Total Agents', value: '23', icon: <Bot className="w-5 h-5" />, color: 'hover:border-blue-400 hover:shadow-blue-500/10 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/20', iconBg: 'bg-blue-100 text-blue-600 border border-blue-200' },
  { label: 'Online', value: '21', icon: <CheckCircle2 className="w-5 h-5" />, color: 'hover:border-emerald-400 hover:shadow-emerald-500/10 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/20', iconBg: 'bg-emerald-100 text-emerald-600 border border-emerald-200' },
  { label: 'Average Latency', value: '42ms', icon: <Zap className="w-5 h-5" />, color: 'hover:border-amber-400 hover:shadow-amber-500/10 hover:bg-gradient-to-br hover:from-white hover:to-amber-50/20', iconBg: 'bg-amber-100 text-amber-600 border border-amber-200' },
  { label: 'Tasks Completed Today', value: '2,483', icon: <TrendingUp className="w-5 h-5" />, color: 'hover:border-purple-400 hover:shadow-purple-500/10 hover:bg-gradient-to-br hover:from-white hover:to-purple-50/20', iconBg: 'bg-purple-100 text-purple-600 border border-purple-200' },
];

const agents = [
  {
    id: 'flight',
    name: 'Flight AI', icon: <Plane className="w-5 h-5" />, iconBg: 'bg-blue-100 text-blue-600 border border-blue-200', desc: 'Finds and books optimal flight routes.', status: 'Online',
    load: '68%', latency: '38ms', success: '99.8%',
    tags: ['Flight Search', 'Price Prediction', 'Booking'],
    color: 'hover:border-blue-400 hover:shadow-blue-500/10'
  },
  {
    id: 'hotel',
    name: 'Hotel AI', icon: <Hotel className="w-5 h-5" />, iconBg: 'bg-emerald-100 text-emerald-600 border border-emerald-200', desc: 'Searches and reserves accommodations.', status: 'Online',
    load: '45%', latency: '65ms', success: '99.9%',
    tags: ['Hotel Search', 'Reviews', 'Booking'],
    color: 'hover:border-emerald-400 hover:shadow-emerald-500/10'
  },
  {
    id: 'weather',
    name: 'Weather AI', icon: <Sun className="w-5 h-5" />, iconBg: 'bg-amber-100 text-amber-600 border border-amber-200', desc: 'Provides real-time weather forecasts.', status: 'Online',
    load: '12%', latency: '28ms', success: '100%',
    tags: ['Forecast', 'Alerts', 'Climate'],
    color: 'hover:border-amber-400 hover:shadow-amber-500/10'
  },
  {
    id: 'finance',
    name: 'Finance AI', icon: <CreditCard className="w-5 h-5" />, iconBg: 'bg-purple-100 text-purple-600 border border-purple-200', desc: 'Handles budgets and secure payments.', status: 'Busy',
    load: '92%', latency: '125ms', success: '99.5%',
    tags: ['Budget', 'Currency', 'Optimization'],
    color: 'hover:border-purple-400 hover:shadow-purple-500/10'
  },
  {
    id: 'maps',
    name: 'Maps AI', icon: <MapPin className="w-5 h-5" />, iconBg: 'bg-rose-100 text-rose-600 border border-rose-200', desc: 'Calculates routes and distances.', status: 'Online',
    load: '34%', latency: '35ms', success: '99.9%',
    tags: ['Navigation', 'Traffic', 'Distance'],
    color: 'hover:border-rose-400 hover:shadow-rose-500/10'
  },
];

const activity = [
  { time: '09:42', agent: 'Flight AI', icon: <Plane className="w-3.5 h-3.5 text-blue-600" />, action: 'Found 12 flights', status: 'Completed' },
  { time: '09:45', agent: 'Weather AI', icon: <Sun className="w-3.5 h-3.5 text-amber-600" />, action: 'Forecast updated', status: 'Completed' },
  { time: '09:48', agent: 'Finance AI', icon: <CreditCard className="w-3.5 h-3.5 text-purple-600" />, action: 'Budget optimized', status: 'Completed' },
  { time: '09:51', agent: 'Maps AI', icon: <MapPin className="w-3.5 h-3.5 text-rose-600" />, action: 'Route generated', status: 'Running' },
];

const AgentsPage: React.FC = () => {
  const { showInfo, showSuccess } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredAgents = filterStatus === 'ALL' 
    ? agents 
    : agents.filter(a => a.status.toUpperCase() === filterStatus);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-[24px] md:text-[32px] font-bold font-display text-navy leading-tight">AI Agents</h1>
          <p className="text-[14px] md:text-[15px] text-slate-500">
            Monitor, manage and optimize every AI agent connected to the router.
          </p>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((m, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${m.color}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs ${m.iconBg}`}>
                  {m.icon}
                </div>
              </div>
              <div>
                <div className="text-[13px] font-medium text-slate-500 mb-1">{m.label}</div>
                <div className="text-[28px] font-bold font-display text-navy tracking-tight leading-none">
                  {m.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 p-1.5 bg-white border border-slate-200/90 rounded-[14px] w-fit shadow-xs">
          {['ALL', 'ONLINE', 'BUSY'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-1.5 rounded-[10px] text-[12px] font-bold transition-all cursor-pointer ${
                filterStatus === tab 
                  ? 'bg-blue-brand text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-navy'
              }`}
            >
              {tab === 'ALL' ? 'All Agents' : tab}
            </button>
          ))}
        </div>

        {/* Main Section + Right Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-8">
          
          {/* Main Section: Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredAgents.map((agent) => (
              <div 
                key={agent.name} 
                className={`bg-white rounded-[24px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${agent.color}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${agent.iconBg}`}>
                      {agent.icon}
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-navy">{agent.name}</div>
                      <div className="text-[12px] text-slate-500 leading-snug max-w-[160px]">{agent.desc}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
                    agent.status === 'Online' ? 'bg-[#E3FBF5] text-[#0E7D69] border border-emerald-200' : 
                    agent.status === 'Busy' ? 'bg-[#FFF3E0] text-[#E65100] border border-orange-200' : 
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-slate-50/80 rounded-[14px] border border-slate-200/70">
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium mb-0.5">Load</div>
                    <div className="text-[13px] font-bold text-navy">{agent.load}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium mb-0.5">Latency</div>
                    <div className="text-[13px] font-bold text-navy">{agent.latency}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium mb-0.5">Success</div>
                    <div className="text-[13px] font-bold text-navy">{agent.success}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6 flex-1">
                  {agent.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-blue-50/70 hover:bg-blue-brand hover:text-white transition-colors text-blue-brand text-[11px] font-medium rounded-full cursor-pointer border border-blue-100/60">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto pt-5 border-t border-slate-200/80">
                  <button 
                    onClick={() => showInfo(`Viewing telemetry and metrics for ${agent.name}...`)}
                    className="py-2 px-3 border border-slate-200/90 rounded-[10px] text-[12.5px] font-bold text-navy hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                  <button 
                    onClick={() => showSuccess(`Restarting ${agent.name}... Process initialized.`)}
                    className="py-2 px-3 border border-slate-200/90 rounded-[10px] text-[12.5px] font-bold text-navy hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel: Agent Health */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[24px] p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] sticky top-[96px] hover:border-blue-400 hover:shadow-blue-500/10 transition-all duration-300">
              <h3 className="text-[16px] font-bold text-navy mb-6">Agent Health</h3>
              
              <div className="flex justify-center mb-8">
                <div className="relative w-[140px] h-[140px]">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#EAF1FF" strokeWidth="12" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#2F5FFF" strokeWidth="12" strokeDasharray="264" strokeDashoffset="0.5" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[24px] font-bold font-display text-navy leading-none">99.8%</span>
                    <span className="text-[11px] font-medium text-slate-500 mt-1">Overall Health</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Online Agents</span>
                  <span className="font-bold text-navy">21</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Busy</span>
                  <span className="font-bold text-navy">2</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Offline</span>
                  <span className="font-bold text-navy">0</span>
                </div>
                <div className="flex justify-between items-center text-[13px] pt-4 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Average Response</span>
                  <span className="font-bold text-navy">42ms</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">System Status</span>
                  <span className="font-bold text-[#0E7D69] bg-[#E3FBF5] px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide border border-emerald-200">Healthy</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Section: Recent Agent Activity */}
        <div className="bg-white rounded-[24px] p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover:border-indigo-300 transition-all duration-300">
          <h3 className="text-[16px] font-bold text-navy mb-5">Recent Agent Activity</h3>

          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Time</th>
                  <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Agent</th>
                  <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Action</th>
                  <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((a, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/50 hover:border-l-4 hover:border-blue-500 transition-all cursor-pointer">
                    <td className="py-3.5 text-[13px] font-medium text-slate-500 whitespace-nowrap pl-2">{a.time}</td>
                    <td className="py-3.5 text-[13px] font-bold text-navy whitespace-nowrap flex items-center gap-2">
                      <div className="p-1 rounded-md bg-slate-100/80">
                        {a.icon}
                      </div>
                      {a.agent}
                    </td>
                    <td className="py-3.5 text-[13px] font-medium text-slate-600 whitespace-nowrap">{a.action}</td>
                    <td className="py-3.5 text-right whitespace-nowrap pr-2">
                      <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full ${
                        a.status === 'Completed' ? 'bg-[#E3FBF5] text-[#0E7D69] border border-emerald-200' : 'bg-amber-400 text-amber-950 border border-amber-300 shadow-xs animate-pulse'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;

