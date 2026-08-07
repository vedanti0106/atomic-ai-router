import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardNav: React.FC = () => {
  const location = useLocation();
  const links = ['Overview', 'Agents', 'Payments', 'Logs'];

  return (
    <nav className="rounded-[18px] px-[22px] py-[14px] flex items-center justify-between mb-[22px]"
      style={{ background: '#1E1B33' }}>

      {/* Left side */}
      <div className="flex items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5 text-white font-semibold text-[15px]">
          <span className="w-[9px] h-[9px] rounded-full bg-[#2FD1B5] shrink-0"></span>
          <span>AI Router</span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 ml-4">
          {links.map((link) => (
            <Link
              key={link}
              to={link === 'Overview' ? '/dashboard' : `/dashboard/${link.toLowerCase()}`}
              className={`text-[13.5px] font-medium transition-colors pb-0.5 ${
                (link === 'Overview' && location.pathname === '/dashboard')
                  ? 'text-white border-b border-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {link}
            </Link>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:block rounded-[10px] px-4 py-2 text-[13px] w-[220px]"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
          Search agents, logs, payments
        </div>

        {/* Bell */}
        <span className="text-[16px] text-white/70 cursor-pointer select-none">🔔</span>

        {/* User pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full pl-1.5"
          style={{ background: 'linear-gradient(135deg,#FF9A5A,#FF7EB6)' }}>
          <div className="w-7 h-7 rounded-full bg-white shrink-0"></div>
          <span className="text-white text-[12.5px] font-medium pr-1">Emma Woodhouse</span>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
