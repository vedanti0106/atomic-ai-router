import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="h-[64px] bg-white border-b border-line flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">

      <div className="flex items-center gap-3">
        {/* Hamburger - mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-[10px] hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xs md:max-w-md">
          <div className="relative flex items-center">
            <svg className="w-4 h-4 absolute left-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-50 border border-line rounded-full py-2 pl-9 pr-4 text-[13px] text-ink focus:outline-none focus:border-blue-brand transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 md:gap-5">

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-brand rounded-full border border-white"></span>
        </button>

        <div className="w-px h-6 bg-line hidden sm:block"></div>

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {userInitial}
          </div>
          <div className="hidden md:block">
            <div className="text-[13px] font-semibold text-navy leading-tight">{userName}</div>
            <div className="text-[11px] text-slate-500">Admin</div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
