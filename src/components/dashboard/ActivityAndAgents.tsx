import React from 'react';

const requests = [
  { agent: 'Flight AI', time: 'Just now', status: 'Running' },
  { agent: 'Hotel AI', time: '2s ago', status: 'Completed' },
  { agent: 'Weather AI', time: '5s ago', status: 'Completed' },
  { agent: 'Finance AI', time: '12s ago', status: 'Waiting' },
  { agent: 'Maps AI', time: '1m ago', status: 'Completed' },
];

const overview = [
  { name: 'Flight AI', status: 'Online', latency: '42ms', avail: '99.9%' },
  { name: 'Hotel AI', status: 'Online', latency: '65ms', avail: '99.9%' },
  { name: 'Weather AI', status: 'Online', latency: '28ms', avail: '100%' },
  { name: 'Finance AI', status: 'Degraded', latency: '850ms', avail: '98.5%' },
  { name: 'Maps AI', status: 'Online', latency: '35ms', avail: '99.9%' },
];

const ActivityAndAgents: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
      
      {/* Live Request Activity */}
      <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] hover-lift-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-bold text-navy font-display">Live Request Activity</h3>
          <span className="w-2 h-2 rounded-full bg-blue-brand animate-pulse"></span>
        </div>
        
        <div className="relative border-l-2 border-line ml-3 flex flex-col gap-6">
          {requests.map((r, i) => (
            <div key={i} className="relative pl-6 p-2 rounded-xl transition-all duration-200 hover:bg-blue-50/40 hover:translate-x-1 cursor-pointer">
              {/* Timeline Dot */}
              <div className={`absolute -left-[7px] top-3.5 w-3 h-3 rounded-full border-2 border-white ${
                r.status === 'Running' ? 'bg-blue-brand ring-4 ring-sky' : 'bg-slate-300'
              }`}></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[14px] font-semibold text-navy">{r.agent}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5">{r.time}</div>
                </div>
                <div className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${
                  r.status === 'Running' ? 'bg-blue-brand text-white' : 
                  r.status === 'Waiting' ? 'bg-slate-100 text-slate-500' : 'bg-sky text-blue-brand'
                }`}>
                  {r.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Overview */}
      <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] hover-lift-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-bold text-navy font-display">Agent Overview</h3>
          <button className="text-[13px] font-semibold text-blue-brand hover:underline">View All</button>
        </div>

        <div className="flex flex-col gap-3">
          {overview.map((o, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-[16px] border border-line hover-row-glow hover:border-blue-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${o.status === 'Online' ? 'bg-sky text-blue-brand' : 'bg-slate-100 text-slate-500'}`}>
                  🤖
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-navy leading-tight">{o.name}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${o.status === 'Online' ? 'bg-blue-brand' : 'bg-slate-400'}`}></span>
                    {o.status}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Latency</div>
                  <div className="text-[13px] font-semibold text-navy mt-0.5">{o.latency}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Uptime</div>
                  <div className="text-[13px] font-semibold text-navy mt-0.5">{o.avail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ActivityAndAgents;
