import React from 'react';

const executions = [
  { time: '14:22:10', req: 'REQ-9942', agent: 'Flight AI', status: 'Success' },
  { time: '14:22:08', req: 'REQ-9941', agent: 'Hotel AI', status: 'Success' },
  { time: '14:22:05', req: 'REQ-9940', agent: 'Weather AI', status: 'Success' },
  { time: '14:21:59', req: 'REQ-9939', agent: 'Finance AI', status: 'Failed' },
  { time: '14:21:50', req: 'REQ-9938', agent: 'Maps AI', status: 'Success' },
];

const HealthAndExecutions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      {/* System Health */}
      <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-[17px] font-bold text-navy font-display">System Health</h3>
            <div className="text-[13px] text-slate-500 mt-1">99.98% overall uptime</div>
          </div>
          <select className="bg-slate-50 border border-line rounded-[10px] px-3 py-1.5 text-[12px] font-medium text-navy focus:outline-none">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
          </select>
        </div>

        <div className="flex-1 min-h-[160px] relative mt-4">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-full h-px bg-line/50"></div>
            ))}
          </div>
          
          {/* Simple blue line chart */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polyline 
              points="0,80 10,75 20,85 30,50 40,60 50,45 60,30 70,42 80,25 90,30 100,10" 
              fill="none" 
              stroke="#2F5FFF" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Dots */}
            <circle cx="30" cy="50" r="3" fill="#2F5FFF" className="animate-pulse" />
            <circle cx="60" cy="30" r="3" fill="#2F5FFF" className="animate-pulse" />
            <circle cx="100" cy="10" r="4" fill="#2F5FFF" className="ring-4 ring-sky" />
          </svg>
        </div>
      </div>

      {/* Latest Executions */}
      <div className="bg-white rounded-[24px] p-7 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-bold text-navy font-display">Latest Executions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Time</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Request</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Agent</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((e, i) => (
                <tr key={i} className="border-b border-line last:border-b-0">
                  <td className="py-3.5 text-[13px] font-medium text-slate-500 whitespace-nowrap">{e.time}</td>
                  <td className="py-3.5 text-[13px] font-semibold text-navy whitespace-nowrap">{e.req}</td>
                  <td className="py-3.5 text-[13px] font-medium text-navy whitespace-nowrap">{e.agent}</td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                      e.status === 'Success' ? 'bg-sky text-blue-brand' : 'bg-red-50 text-red-600'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default HealthAndExecutions;
