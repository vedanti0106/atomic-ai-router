import React from 'react';

const liveLogs = [
  { name: 'Planner Agent', status: 'init',      style: 'info' },
  { name: 'Flight AI',     status: 'searching', style: 'warn' },
  { name: 'Hotel AI',      status: 'complete',  style: 'ok' },
  { name: 'Weather AI',    status: 'complete',  style: 'ok' },
  { name: 'Payment',       status: 'confirmed', style: 'ok' },
];

const pillStyle: Record<string, React.CSSProperties> = {
  ok:   { background: '#E3FBF5', color: '#0E7D69' },
  warn: { background: '#FFE9D1', color: '#B5651D' },
  info: { background: '#EEECFB', color: '#3D2FA3' },
};

const LiveLogs: React.FC = () => {
  return (
    <div className="rounded-[18px] p-[20px] px-[22px] border" style={{ background: '#fff', borderColor: '#EAE8F5' }}>
      <div className="flex justify-between items-center mb-[18px]">
        <h3 className="text-[15px] font-semibold text-[#1E1B33]">Live logs</h3>
        <span className="text-[12px] font-medium cursor-pointer" style={{ color: '#8B87A3' }}>View all ›</span>
      </div>

      {liveLogs.map((log) => (
        <div key={log.name} className="flex justify-between items-center py-[10px] border-b text-[12.5px] last:border-b-0"
          style={{ borderColor: '#EAE8F5' }}>
          <span className="font-medium text-[#1E1B33]">{log.name}</span>
          <span className="text-[10.5px] font-semibold px-[9px] py-[3px] rounded-full"
            style={pillStyle[log.style]}>
            {log.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default LiveLogs;
