import React from 'react';

const AgentReliability: React.FC = () => {
  return (
    <div className="rounded-[18px] p-[20px] px-[22px] border" style={{ background: '#fff', borderColor: '#EAE8F5' }}>
      <div className="flex justify-between items-center mb-[18px]">
        <h3 className="text-[15px] font-semibold text-[#1E1B33]">Agent reliability</h3>
        <span className="text-[12px] font-medium cursor-pointer" style={{ color: '#8B87A3' }}>⋯</span>
      </div>

      <div className="flex items-center gap-5">
        {/* Donut SVG */}
        <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0">
          {/* Background track */}
          <circle cx="60" cy="60" r="46" fill="none" stroke="#F1EFFC" strokeWidth="16" />
          {/* Purple segment — Flight 37% */}
          <circle cx="60" cy="60" r="46" fill="none" stroke="#6C5CE7" strokeWidth="16"
            strokeDasharray="289" strokeDashoffset="0"
            transform="rotate(-90 60 60)" />
          {/* Teal segment — Finance 38% */}
          <circle cx="60" cy="60" r="46" fill="none" stroke="#2FD1B5" strokeWidth="16"
            strokeDasharray="289" strokeDashoffset="181"
            transform="rotate(-90 60 60)" />
          {/* Orange segment — Hotel 25% */}
          <circle cx="60" cy="60" r="46" fill="none" stroke="#FFB05A" strokeWidth="16"
            strokeDasharray="289" strokeDashoffset="253"
            transform="rotate(-90 60 60)" />
          {/* Center label */}
          <text x="60" y="65" textAnchor="middle"
            fontFamily="Space Grotesk, sans-serif"
            fontSize="18" fontWeight="600" fill="#1E1B33">
            99%
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-2.5">
          {[
            { color: '#6C5CE7', label: 'Flight',  pct: '37%' },
            { color: '#2FD1B5', label: 'Finance', pct: '38%' },
            { color: '#FFB05A', label: 'Hotel',   pct: '25%' },
          ].map(({ color, label, pct }) => (
            <div key={label} className="flex items-center gap-2 text-[12.5px]" style={{ color: '#8B87A3' }}>
              <span className="w-[9px] h-[9px] rounded-[3px] shrink-0" style={{ background: color }}></span>
              <span>{label}</span>
              <strong className="text-[#1E1B33] font-semibold ml-0.5">{pct}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentReliability;
