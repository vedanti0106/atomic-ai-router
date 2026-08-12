import React from 'react';
import { Zap, Bot, CheckCircle2, CreditCard } from 'lucide-react';

const metrics = [
  { label: 'Requests Today', value: '12,483', trend: '+0.4%', icon: <Zap className="w-5 h-5" />, iconBg: 'bg-blue-50 text-blue-brand', borderHover: 'hover:border-blue-400' },
  { label: 'Active Agents', value: '23', trend: '+2', icon: <Bot className="w-5 h-5" />, iconBg: 'bg-purple-50 text-purple-600', borderHover: 'hover:border-purple-400' },
  { label: 'Success Rate', value: '99.9%', trend: '+0.1%', icon: <CheckCircle2 className="w-5 h-5" />, iconBg: 'bg-emerald-50 text-emerald-600', borderHover: 'hover:border-emerald-400' },
  { label: 'x402 Payments', value: '2,104', trend: 'Stable', icon: <CreditCard className="w-5 h-5" />, iconBg: 'bg-cyan-50 text-cyan-600', borderHover: 'hover:border-cyan-400' },
];

const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {metrics.map((m, idx) => (
        <div 
          key={idx} 
          className={`bg-white rounded-[20px] p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover-lift-card cursor-pointer group transition-all duration-300 hover:shadow-md ${m.borderHover}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${m.iconBg}`}>
              {m.icon}
            </div>
            <div className="bg-slate-100/90 group-hover:bg-blue-50 group-hover:text-blue-brand px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-600 transition-colors">
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

