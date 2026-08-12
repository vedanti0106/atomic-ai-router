import React from 'react';

interface DashboardMetricsProps {
  metrics: {
    totalRequests: string;
    activeAgents: string;
    successRate: string;
    settledVolume: string;
    paymentCount: string;
  } | null;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  const displayMetrics = [
    { label: 'Requests Today', value: metrics?.totalRequests || '0', trend: 'Live', icon: '⚡' },
    { label: 'Active Agents', value: metrics?.activeAgents || '0', trend: 'Online', icon: '🤖' },
    { label: 'Success Rate', value: metrics?.successRate || '100.0%', trend: 'Real-time', icon: '✅' },
    { label: 'Settled Volume', value: metrics?.settledVolume ? `$${metrics.settledVolume} USDC` : '$0.00 USDC', trend: 'Stable', icon: '💳' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {displayMetrics.map((m, idx) => (
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
