import React from 'react';

const SystemHealth: React.FC = () => {
  return (
    <div className="rounded-[18px] p-[20px] px-[22px] border" style={{ background: '#fff', borderColor: '#EAE8F5' }}>
      <div className="flex justify-between items-center mb-[18px]">
        <h3 className="text-[15px] font-semibold text-[#1E1B33]">System health</h3>
        <span className="text-[12px] font-medium cursor-pointer" style={{ color: '#6C5CE7' }}>Uptime 99.98% ›</span>
      </div>

      <svg className="mt-2.5 w-full" height="110" viewBox="0 0 300 110" preserveAspectRatio="none">
        <polyline
          points="0,80 40,70 80,85 120,50 160,60 200,30 240,42 300,20"
          fill="none" stroke="#6C5CE7" strokeWidth="3"
        />
        <polyline
          points="0,95 40,90 80,92 120,78 160,82 200,65 240,70 300,58"
          fill="none" stroke="#2FD1B5" strokeWidth="3"
        />
      </svg>
    </div>
  );
};

export default SystemHealth;
