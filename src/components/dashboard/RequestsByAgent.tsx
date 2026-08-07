import React from 'react';

const bars = [
  { label: 'Flight',  height: 96,  color: '#6C5CE7' },
  { label: 'Hotel',   height: 70,  color: '#FFB05A' },
  { label: 'Finance', height: 120, color: '#2FD1B5' },
  { label: 'Weather', height: 54,  color: '#FF7EB6' },
  { label: 'Maps',    height: 82,  color: '#B8B2F5' },
];

const RequestsByAgent: React.FC = () => {
  return (
    <div className="rounded-[18px] p-[20px] px-[22px] border" style={{ background: '#fff', borderColor: '#EAE8F5' }}>
      <div className="flex justify-between items-center mb-[18px]">
        <h3 className="text-[15px] font-semibold text-[#1E1B33]">Requests by agent</h3>
        <span className="text-[12px] font-medium cursor-pointer" style={{ color: '#8B87A3' }}>This week ›</span>
      </div>
      <div className="flex items-end gap-[18px] h-[150px] pt-[10px]">
        {bars.map((bar) => (
          <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full rounded-t-[8px] rounded-b-[3px]"
              style={{ height: bar.height, background: bar.color }}
            ></div>
            <span className="text-[11px]" style={{ color: '#8B87A3' }}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsByAgent;
