import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const metrics = [
  { label: 'Total Agents', value: '23', icon: '🤖' },
  { label: 'Online', value: '21', icon: '✅' },
  { label: 'Average Latency', value: '42ms', icon: '⚡' },
  { label: 'Tasks Completed Today', value: '2,483', icon: '📈' },
];

const agents = [
  {
    name: 'Flight AI', icon: '✈', desc: 'Finds and books optimal flight routes.', status: 'Online',
    load: '68%', latency: '38ms', success: '99.8%',
    tags: ['Flight Search', 'Price Prediction', 'Booking']
  },
  {
    name: 'Hotel AI', icon: '🛏', desc: 'Searches and reserves accommodations.', status: 'Online',
    load: '45%', latency: '65ms', success: '99.9%',
    tags: ['Hotel Search', 'Reviews', 'Booking']
  },
  {
    name: 'Weather AI', icon: '☀', desc: 'Provides real-time weather forecasts.', status: 'Online',
    load: '12%', latency: '28ms', success: '100%',
    tags: ['Forecast', 'Alerts', 'Climate']
  },
  {
    name: 'Finance AI', icon: '💳', desc: 'Handles budgets and secure payments.', status: 'Busy',
    load: '92%', latency: '125ms', success: '99.5%',
    tags: ['Budget', 'Currency', 'Optimization']
  },
  {
    name: 'Maps AI', icon: '🗺', desc: 'Calculates routes and distances.', status: 'Online',
    load: '34%', latency: '35ms', success: '99.9%',
    tags: ['Navigation', 'Traffic', 'Distance']
  },
];

const activity = [
  { time: '09:42', agent: 'Flight AI', action: 'Found 12 flights', status: 'Completed' },
  { time: '09:45', agent: 'Weather AI', action: 'Forecast updated', status: 'Completed' },
  { time: '09:48', agent: 'Finance AI', action: 'Budget optimized', status: 'Completed' },
  { time: '09:51', agent: 'Maps AI', action: 'Route generated', status: 'Running' },
];

const AgentsPage: React.FC = () => {
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

        {/* Top Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-full bg-sky flex items-center justify-center text-xl text-blue-brand">
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

        {/* Main Section + Right Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-8">
          
          {/* Main Section: Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {agents.map((agent) => (
              <div key={agent.name} className="bg-white rounded-[24px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-sky flex items-center justify-center text-[20px] text-blue-brand shrink-0">
                      {agent.icon}
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-navy">{agent.name}</div>
                      <div className="text-[12px] text-slate-500 leading-snug max-w-[160px]">{agent.desc}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
                    agent.status === 'Online' ? 'bg-[#E3FBF5] text-[#0E7D69]' : 
                    agent.status === 'Busy' ? 'bg-[#FFF3E0] text-[#E65100]' : 
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-slate-50 rounded-[12px] border border-line/50">
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
                    <span key={tag} className="px-2.5 py-1 bg-sky text-blue-brand text-[11px] font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto pt-5 border-t border-line">
                  <button className="py-2 px-3 border border-line rounded-[10px] text-[13px] font-semibold text-navy hover:bg-slate-50 transition-colors">
                    View Details
                  </button>
                  <button className="py-2 px-3 border border-line rounded-[10px] text-[13px] font-semibold text-navy hover:bg-slate-50 transition-colors">
                    Restart Agent
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel: Agent Health */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] sticky top-[96px]">
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
                <div className="flex justify-between items-center text-[13px] pt-4 border-t border-line">
                  <span className="text-slate-500 font-medium">Average Response</span>
                  <span className="font-bold text-navy">42ms</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">System Status</span>
                  <span className="font-bold text-[#0E7D69] bg-[#E3FBF5] px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide">Healthy</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Section: Recent Agent Activity */}
        <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
          <h3 className="text-[16px] font-bold text-navy mb-5">Recent Agent Activity</h3>

          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-line">
                  <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Time</th>
                  <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Agent</th>
                  <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Action</th>
                  <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((a, i) => (
                  <tr key={i} className="border-b border-line last:border-b-0">
                    <td className="py-3.5 text-[13px] font-medium text-slate-500 whitespace-nowrap">{a.time}</td>
                    <td className="py-3.5 text-[13px] font-bold text-navy whitespace-nowrap flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-sky flex items-center justify-center text-[10px] text-blue-brand shrink-0">
                        {a.agent.includes('Flight') ? '✈' : a.agent.includes('Weather') ? '☀' : a.agent.includes('Finance') ? '💳' : a.agent.includes('Maps') ? '🗺' : '🛏'}
                      </div>
                      {a.agent}
                    </td>
                    <td className="py-3.5 text-[13px] font-medium text-slate-600 whitespace-nowrap">{a.action}</td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full ${
                        a.status === 'Completed' ? 'bg-sky text-blue-brand' : 'bg-blue-brand text-white'
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
