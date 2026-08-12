import React from 'react';
import { Plane, Hotel, Sun, CreditCard, MapPin } from 'lucide-react';

interface AgentInfo {
  name: string;
  status: string;
  latency: string;
  avail: string;
  icon: React.ReactNode;
  iconBg: string;
}

const requests = [
  { agent: 'Flight AI', time: 'Just now', status: 'Running', icon: <Plane className="w-4 h-4 text-blue-600" /> },
  { agent: 'Hotel AI', time: '2s ago', status: 'Completed', icon: <Hotel className="w-4 h-4 text-emerald-600" /> },
  { agent: 'Weather AI', time: '5s ago', status: 'Completed', icon: <Sun className="w-4 h-4 text-amber-600" /> },
  { agent: 'Finance AI', time: '12s ago', status: 'Waiting', icon: <CreditCard className="w-4 h-4 text-purple-600" /> },
  { agent: 'Maps AI', time: '1m ago', status: 'Completed', icon: <MapPin className="w-4 h-4 text-rose-600" /> },
];

const overview: AgentInfo[] = [
  { 
    name: 'Flight AI', 
    status: 'Online', 
    latency: '42ms', 
    avail: '99.9%', 
    icon: <Plane className="w-4 h-4" />, 
    iconBg: 'bg-blue-100 text-blue-600 border border-blue-200' 
  },
  { 
    name: 'Hotel AI', 
    status: 'Online', 
    latency: '65ms', 
    avail: '99.9%', 
    icon: <Hotel className="w-4 h-4" />, 
    iconBg: 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
  },
  { 
    name: 'Weather AI', 
    status: 'Online', 
    latency: '28ms', 
    avail: '100%', 
    icon: <Sun className="w-4 h-4" />, 
    iconBg: 'bg-amber-100 text-amber-600 border border-amber-200' 
  },
  { 
    name: 'Finance AI', 
    status: 'Degraded', 
    latency: '850ms', 
    avail: '98.5%', 
    icon: <CreditCard className="w-4 h-4" />, 
    iconBg: 'bg-purple-100 text-purple-600 border border-purple-200' 
  },
  { 
    name: 'Maps AI', 
    status: 'Online', 
    latency: '35ms', 
    avail: '99.9%', 
    icon: <MapPin className="w-4 h-4" />, 
    iconBg: 'bg-rose-100 text-rose-600 border border-rose-200' 
  },
];

const ActivityAndAgents: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
      
      {/* Live Request Activity */}
      <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover-lift-card transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-bold text-navy font-display">Live Request Activity</h3>
          <span className="w-2.5 h-2.5 rounded-full bg-blue-brand animate-pulse" title="Live telemetry"></span>
        </div>
        
        <div className="relative border-l-2 border-slate-200/80 ml-3 flex flex-col gap-5">
          {requests.map((r, i) => (
            <div key={i} className="relative pl-6 p-2 rounded-xl transition-all duration-200 hover:bg-blue-50/50 hover:translate-x-1 cursor-pointer border border-transparent hover:border-blue-100">
              {/* Timeline Dot */}
              <div className={`absolute -left-[7px] top-3.5 w-3 h-3 rounded-full border-2 border-white ${
                r.status === 'Running' ? 'bg-amber-400 ring-4 ring-amber-100 animate-pulse' :
                r.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300'
              }`}></div>
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-100/80">
                    {r.icon}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-navy leading-tight">{r.agent}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{r.time}</div>
                  </div>
                </div>

                <div className={`text-[11.5px] font-bold px-3 py-1 rounded-full transition-all ${
                  r.status === 'Running' 
                    ? 'bg-amber-400 text-amber-950 font-bold border border-amber-300/80 shadow-xs animate-pulse' : 
                  r.status === 'Completed' 
                    ? 'bg-[#E3FBF5] text-[#0E7D69] border border-emerald-200' : 
                    'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {r.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Overview */}
      <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,27,61,0.03)] hover-lift-card transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-bold text-navy font-display">Agent Overview</h3>
          <button className="text-[13px] font-bold text-blue-brand hover:underline cursor-pointer">View All</button>
        </div>

        <div className="flex flex-col gap-3">
          {overview.map((o, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-[16px] border border-slate-200/80 hover:border-blue-400 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white hover:bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${o.iconBg}`}>
                  {o.icon}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-navy leading-tight">{o.name}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${o.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                    {o.status}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-5 text-right">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">Latency</div>
                  <div className="text-[13px] font-bold text-navy mt-0.5">{o.latency}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">Uptime</div>
                  <div className="text-[13px] font-bold text-navy mt-0.5">{o.avail}</div>
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

