import React from 'react';

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-[18px]">

      {/* Requests today — orange hero (spans 2 cols) */}
      <div className="col-span-2 rounded-[18px] p-[18px] pb-4 flex flex-col justify-between min-h-[118px]"
        style={{ background: 'linear-gradient(150deg,#FFC784,#FF9F5A)', color: '#5C3400' }}>
        <div className="flex justify-between items-start">
          <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[15px]"
            style={{ background: 'rgba(255,255,255,0.35)' }}>
            ⚡
          </div>
        </div>
        <div>
          <div className="text-[12px] font-medium opacity-85 mt-3">Requests today</div>
          <div className="text-[24px] font-semibold font-display mt-0.5">12,483</div>
        </div>
      </div>

      {/* Success Rate — white */}
      <div className="col-span-1 rounded-[18px] p-[18px] pb-4 flex flex-col justify-between min-h-[118px] border"
        style={{ background: '#fff', borderColor: '#EAE8F5', color: '#1E1B33' }}>
        <div className="flex justify-between items-start">
          <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[15px]"
            style={{ background: '#F1EFFC', color: '#6C5CE7' }}>
            ✅
          </div>
          <span className="text-[11px] font-medium px-2 py-1 rounded-full"
            style={{ background: '#E3FBF5', color: '#0E7D69' }}>+0.4%</span>
        </div>
        <div>
          <div className="text-[12px] font-medium mt-3" style={{ color: '#8B87A3' }}>Success rate</div>
          <div className="text-[24px] font-semibold font-display mt-0.5">99.9%</div>
        </div>
      </div>

      {/* Active Agents — white */}
      <div className="col-span-1 rounded-[18px] p-[18px] pb-4 flex flex-col justify-between min-h-[118px] border"
        style={{ background: '#fff', borderColor: '#EAE8F5', color: '#1E1B33' }}>
        <div className="flex justify-between items-start">
          <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[15px]"
            style={{ background: '#F1EFFC', color: '#6C5CE7' }}>
            🤖
          </div>
        </div>
        <div>
          <div className="text-[12px] font-medium mt-3" style={{ color: '#8B87A3' }}>Active agents</div>
          <div className="text-[24px] font-semibold font-display mt-0.5">23</div>
        </div>
      </div>

      {/* x402 Payments — purple hero (spans 2 cols) */}
      <div className="col-span-2 rounded-[18px] p-[18px] pb-4 flex flex-col justify-between min-h-[118px]"
        style={{ background: 'linear-gradient(150deg,#8B7BFF,#6C5CE7)', color: '#fff' }}>
        <div className="flex justify-between items-start">
          <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[15px]"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            🔒
          </div>
        </div>
        <div>
          <div className="text-[12px] font-medium opacity-85 mt-3">x402 payments</div>
          <div className="text-[24px] font-semibold font-display mt-0.5">2,104</div>
        </div>
      </div>

    </div>
  );
};

export default StatsCards;
