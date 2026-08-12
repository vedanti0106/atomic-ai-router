import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TravelLogoIcon } from '../TravelLogo';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Bot, 
  CheckCircle2, 
  CreditCard, 
  Lock, 
  FileText, 
  Settings,
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  hoverClass: string;
  activeClass: string;
  iconBg: string;
}

const navItems: NavItem[] = [
  { 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: <LayoutDashboard className="w-4 h-4" />, 
    hoverClass: 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:border-l-4 hover:border-blue-500',
    activeClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-bold',
    iconBg: 'bg-blue-100 text-blue-600'
  },
  { 
    label: 'New Request', 
    path: '/dashboard/new-request', 
    icon: <PlusCircle className="w-4 h-4" />, 
    badge: 'HOT',
    hoverClass: 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-fuchsia-50 hover:text-purple-600 hover:border-l-4 hover:border-purple-500',
    activeClass: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/25 font-bold',
    iconBg: 'bg-purple-100 text-purple-600'
  },
  { 
    label: 'Emergency Response', 
    path: '/dashboard/emergency', 
    icon: <AlertCircle className="w-4 h-4" />, 
    badge: 'NEW',
    hoverClass: 'hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-600 hover:border-l-4 hover:border-red-500',
    activeClass: 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md shadow-red-500/25 font-bold',
    iconBg: 'bg-red-100 text-red-600'
  },
  { 
    label: 'Agents', 
    path: '/dashboard/agents', 
    icon: <Bot className="w-4 h-4" />, 
    badge: '25',
    hoverClass: 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600 hover:border-l-4 hover:border-emerald-500',
    activeClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 font-bold',
    iconBg: 'bg-emerald-100 text-emerald-600'
  },
  { 
    label: 'Tasks', 
    path: '/dashboard/tasks', 
    icon: <CheckCircle2 className="w-4 h-4" />, 
    badge: '4 Live',
    hoverClass: 'hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-600 hover:border-l-4 hover:border-amber-500',
    activeClass: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25 font-bold',
    iconBg: 'bg-amber-100 text-amber-600'
  },
  { 
    label: 'Payments', 
    path: '/dashboard/payments', 
    icon: <CreditCard className="w-4 h-4" />, 
    badge: 'x402',
    hoverClass: 'hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-600 hover:border-l-4 hover:border-cyan-500',
    activeClass: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 font-bold',
    iconBg: 'bg-cyan-100 text-cyan-600'
  },
  { 
    label: 'Escrow', 
    path: '/dashboard/escrow', 
    icon: <Lock className="w-4 h-4" />, 
    badge: '2 Active',
    hoverClass: 'hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 hover:border-l-4 hover:border-rose-500',
    activeClass: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/25 font-bold',
    iconBg: 'bg-rose-100 text-rose-600'
  },
  { 
    label: 'Logs', 
    path: '/dashboard/logs', 
    icon: <FileText className="w-4 h-4" />, 
    badge: 'Live',
    hoverClass: 'hover:bg-gradient-to-r hover:from-slate-100 hover:to-indigo-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500',
    activeClass: 'bg-gradient-to-r from-slate-800 to-indigo-900 text-white shadow-md shadow-slate-700/25 font-bold',
    iconBg: 'bg-indigo-100 text-indigo-600'
  },
  { 
    label: 'Settings', 
    path: '/dashboard/settings', 
    icon: <Settings className="w-4 h-4" />, 
    hoverClass: 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-100 hover:text-blue-700 hover:border-l-4 hover:border-blue-600',
    activeClass: 'bg-gradient-to-r from-slate-800 to-blue-950 text-white shadow-md shadow-slate-800/25 font-bold',
    iconBg: 'bg-slate-200 text-slate-700'
  },
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
          className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50
        w-64 flex-shrink-0 bg-white border-r border-line
        flex flex-col py-6 px-4
        transition-transform duration-300 ease-in-out shadow-sm lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 mb-7">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="group-hover:scale-105 transition-transform">
              <TravelLogoIcon className="w-10 h-10" size={40} />
            </div>
            <div>
              <div className="text-[18px] font-bold text-navy leading-tight tracking-tight group-hover:text-blue-brand transition-colors">Wanderly</div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide">AI Router Network</div>
            </div>
          </Link>
          
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-[12px] font-medium text-[13.5px] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? item.activeClass
                    : `text-slate-600 hover:shadow-xs hover:translate-x-1 ${item.hoverClass}`
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-white/20 text-white' : item.iconBg
                  }`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                    isActive 
                      ? 'bg-white/25 text-white' 
                      : item.badge === 'HOT'
                      ? 'bg-purple-100 text-purple-700 font-extrabold group-hover:bg-purple-600 group-hover:text-white'
                      : item.badge === 'NEW'
                      ? 'bg-red-100 text-red-700 font-extrabold group-hover:bg-red-600 group-hover:text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-navy'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Upgrade Card */}
        <div className="mt-auto px-1 pt-4">
          <div className="bg-gradient-to-br from-blue-50 via-sky/60 to-indigo-50 rounded-[18px] p-4 text-center border border-blue-100/80 shadow-xs relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="w-9 h-9 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-[13px] font-bold text-navy">Upgrade to Pro</div>
            <div className="text-[11px] text-slate-500 mt-0.5 mb-3">Get advanced analytics & router APIs</div>
            <button 
              onClick={() => alert('Upgrade to Wanderly Pro — Custom AI Router Models & Dedicated Algorand Escrow Nodes')}
              className="w-full py-2 bg-white hover:bg-blue-brand hover:text-white text-blue-brand font-bold text-xs rounded-full shadow-xs transition-all duration-200 cursor-pointer"
            >
              View Plans
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
