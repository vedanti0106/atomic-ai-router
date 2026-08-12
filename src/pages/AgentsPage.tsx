import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface Agent {
  name: string;
  icon: string;
  desc: string;
  status: string;
  load: string;
  latency: string;
  success: string;
  tags: string[];
}

const AgentsPage: React.FC = () => {
  const [agentsList, setAgentsList] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/task/agents', {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve active agents.');
      }
      const data = await response.json();
      setAgentsList(data.agents || []);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to Hono backend. Ensure the backend server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalAgents = agentsList.length;
  const onlineAgents = agentsList.filter(a => a.status === 'Online').length;
  const busyAgents = agentsList.filter(a => a.status === 'Busy').length;

  const displayMetrics = [
    { label: 'Total Agents', value: totalAgents.toString(), icon: '🤖' },
    { label: 'Online', value: onlineAgents.toString(), icon: '✅' },
    { label: 'Average Latency', value: totalAgents === 0 ? '0ms' : '42ms', icon: '⚡' },
    { label: 'System Uptime', value: '99.9%', icon: '📈' },
  ];



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

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Top Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {displayMetrics.map((m, idx) => (
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
            {loading ? (
              <div className="col-span-2 p-12 text-center bg-white rounded-[24px] border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
                <div className="w-8 h-8 border-4 border-sky border-t-blue-brand rounded-full animate-spin mx-auto mb-3"></div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Retrieving Connected Agents...</span>
              </div>
            ) : agentsList.length === 0 ? (
              <div className="col-span-2 p-16 text-center bg-white rounded-[24px] border border-line border-dashed">
                <div className="text-4xl mb-3">🤖</div>
                <h4 className="text-[15px] font-bold text-navy mb-1">No AI Agents Registered</h4>
                <p className="text-[12.5px] text-slate-500 max-w-[280px] mx-auto">
                  Seed the database using the reset script to register the standard AI routing nodes.
                </p>
              </div>
            ) : (
              agentsList.map((agent) => (
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


                </div>
              ))
            )}
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
                  <span className="font-bold text-navy">{onlineAgents}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Busy</span>
                  <span className="font-bold text-navy">{busyAgents}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Offline</span>
                  <span className="font-bold text-navy">{totalAgents - onlineAgents - busyAgents}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] pt-4 border-t border-line">
                  <span className="text-slate-500 font-medium">Average Response</span>
                  <span className="font-bold text-navy">{totalAgents === 0 ? '0ms' : '42ms'}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">System Status</span>
                  <span className="font-bold text-[#0E7D69] bg-[#E3FBF5] px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide">Healthy</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>



      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;
