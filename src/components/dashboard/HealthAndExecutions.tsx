import React from 'react';
import { ChevronDown } from 'lucide-react';

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
      <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] flex flex-col hover-lift-card transition-all">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-[18px] font-bold text-navy font-display">System Health</h3>
          </div>
          <div className="relative">
            <select className="appearance-none bg-[#E3FBF5] text-[#0E7D69] border border-emerald-200/90 rounded-xl px-4 py-1.5 pr-8 text-[13px] font-semibold focus:outline-none cursor-pointer shadow-xs hover:bg-emerald-100/70 transition-colors">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#0E7D69] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
          </div>
        </div>

        <div className="flex-1 min-h-[170px] relative mt-2 flex flex-col justify-between">
          {/* Subtle dashed horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-full border-b border-dashed border-slate-200/80"></div>
            ))}
          </div>
          
          {/* Fine Emerald Green Line Chart with Animated Thin Stroke */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Green Thin Line Path */}
            <polyline 
              points="2,76 12,70 20,80 32,56 42,62 62,42 72,50 82,34 90,38 98,16" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="animated-graph-line"
            />

            {/* Delicate Glowing Vertex Dots */}
            {/* Point 1 */}
            <circle cx="32" cy="56" r="4.5" fill="#10B981" fillOpacity="0.2" />
            <circle cx="32" cy="56" r="1.8" fill="#10B981" />

            {/* Point 2 */}
            <circle cx="62" cy="42" r="4.5" fill="#10B981" fillOpacity="0.2" />
            <circle cx="62" cy="42" r="1.8" fill="#10B981" />

            {/* Point 3 (End Peak) */}
            <circle cx="98" cy="16" r="5" fill="#10B981" fillOpacity="0.25" className="animate-pulse" />
            <circle cx="98" cy="16" r="2" fill="#10B981" />
          </svg>
        </div>
      </div>

      {/* Latest Executions */}
      <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover-lift-card transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-bold text-navy font-display">Latest Executions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Time</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Request</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase">Agent</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-400 font-sans tracking-wide uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((e, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <td className="py-3.5 text-[13px] font-medium text-slate-500 whitespace-nowrap">{e.time}</td>
                  <td className="py-3.5 text-[13px] font-bold text-navy whitespace-nowrap font-mono">{e.req}</td>
                  <td className="py-3.5 text-[13px] font-bold text-navy whitespace-nowrap">{e.agent}</td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full ${
                      e.status === 'Success' ? 'bg-[#E3FBF5] text-[#0E7D69]' : 'bg-red-50 text-red-600 border border-red-200'
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

