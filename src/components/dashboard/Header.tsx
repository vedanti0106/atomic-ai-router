import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-[72px] bg-white border-b border-line flex items-center justify-between px-8 sticky top-0 z-40">
      
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <svg className="w-4 h-4 absolute left-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search agents, logs, payments..." 
            className="w-full bg-slate-50 border border-line rounded-full py-2 pl-10 pr-4 text-[13.5px] text-ink focus:outline-none focus:border-blue-brand transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Status Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-sky px-3 py-1.5 rounded-full border border-blue-brand/20">
          <span className="w-2 h-2 rounded-full bg-blue-brand animate-pulse"></span>
          <span className="text-[12px] font-semibold text-blue-brand">AI Router Online</span>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-brand rounded-full border border-white"></span>
        </button>

        <div className="w-px h-6 bg-line"></div>

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white font-semibold text-sm">
            E
          </div>
          <div className="hidden md:block">
            <div className="text-[13px] font-semibold text-navy leading-tight">Emma Wood</div>
            <div className="text-[11px] text-slate-500">Admin</div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
