import React from 'react';

const alerts = [
  { event: 'Latency spike',  agent: 'Finance AI' },
  { event: 'Retry triggered',agent: 'Maps AI' },
  { event: 'Rate limit near',agent: 'Flight AI' },
  { event: 'Token refresh',  agent: 'Router core' },
];

const AlertsLogs: React.FC = () => {
  return (
    <div className="rounded-[18px] p-[20px] px-[22px] border" style={{ background: '#fff', borderColor: '#EAE8F5' }}>
      <div className="flex justify-between items-center mb-[18px]">
        <h3 className="text-[15px] font-semibold text-[#1E1B33]">Alerts &amp; logs</h3>
        <span className="text-[12px] font-medium cursor-pointer" style={{ color: '#8B87A3' }}>12 active ›</span>
      </div>

      {alerts.map((a) => (
        <div key={a.event} className="flex justify-between items-center py-[10px] border-b text-[12.5px] last:border-b-0"
          style={{ borderColor: '#EAE8F5' }}>
          <span className="font-medium text-[#1E1B33]">{a.event}</span>
          <span style={{ color: '#8B87A3' }}>{a.agent}</span>
        </div>
      ))}
    </div>
  );
};

export default AlertsLogs;
