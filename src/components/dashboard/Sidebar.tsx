import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TravelLogoIcon } from '../TravelLogo';

const navItems = [
  { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
  { label: 'New Request', icon: '➕', path: '/dashboard/new-request' },
  { label: 'Agents', icon: '🤖', path: '/dashboard/agents' },
  { label: 'Tasks', icon: '✅', path: '/dashboard/tasks' },
  { label: 'Payments', icon: '💳', path: '/dashboard/payments' },
  { label: 'Escrow', icon: '🔒', path: '/dashboard/escrow' },
  { label: 'Logs', icon: '📄', path: '/dashboard/logs' },
  { label: 'Settings', icon: '⚙', path: '/dashboard/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50
        w-64 flex-shrink-0 bg-white border-r border-line
        flex flex-col py-6 px-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-3">
            <TravelLogoIcon className="w-10 h-10" size={40} />
            <div>
              <div className="text-[18px] font-bold text-navy leading-tight tracking-tight">Wanderly</div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide">Travel with us</div>
            </div>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-medium text-[14px] transition-all duration-200 ${
                  isActive
                    ? 'bg-sky text-blue-brand font-bold shadow-xs'
                    : 'text-slate-600 hover:text-blue-brand hover:bg-blue-50/80 hover:translate-x-1.5 hover:shadow-xs'
                }`}
              >
                <span className="text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Area */}
        <div className="mt-auto px-2 pt-6">
          <div className="bg-sky rounded-[14px] p-4 text-center">
            <div className="w-10 h-10 mx-auto bg-blue-brand text-white rounded-full flex items-center justify-center mb-2">
              ✨
            </div>
            <div className="text-sm font-semibold text-navy">Upgrade to Pro</div>
            <div className="text-xs text-slate-500 mt-1 mb-3">Get advanced analytics</div>
            <button className="w-full py-2 bg-white text-blue-brand font-semibold text-xs rounded-full shadow-sm">
              View Plans
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
