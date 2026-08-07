import React from 'react';

const metrics = [
  { label: 'Requests Today', value: '12,483', trend: '+0.4%', icon: '⚡' },
  { label: 'Active Agents', value: '23', trend: '+2', icon: '🤖' },
  { label: 'Success Rate', value: '99.9%', trend: '+0.1%', icon: '✅' },
  { label: 'x402 Payments', value: '2,104', trend: 'Stable', icon: '💳' },
];

const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {metrics.map((m, idx) => (
        <div key={idx} className="bg-white rounded-[20px] p-6 border border-line shadow-[0_4px_24px_rgba(15,27,61,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-full bg-sky flex items-center justify-center text-xl text-blue-brand">
              {m.icon}
            </div>
            <div className="bg-sky px-2.5 py-1 rounded-full text-[11px] font-semibold text-blue-brand">
              {m.trend}
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
  );
};

export default DashboardMetrics;
