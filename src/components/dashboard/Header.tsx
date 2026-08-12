import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { 
  Bell, 
  Search, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Check, 
  Trash2,
  LogOut,
  User,
  ChevronDown,
  Shield
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'info';
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Flight AI Route Completed',
    message: 'Route optimization for Cusco trip completed with 99.9% confidence.',
    time: '2 min ago',
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'High Latency Warning',
    message: 'Weather AI agent response latency reached 185ms on node us-east-1.',
    time: '14 min ago',
    read: false,
    type: 'warning',
  },
  {
    id: '3',
    title: 'Payment Invoice Processed',
    message: 'Transaction #x402-9182 of $14.50 processed successfully.',
    time: '1 hour ago',
    read: false,
    type: 'info',
  },
  {
    id: '4',
    title: 'Hotel AI Agent Ready',
    message: 'Agent instance updated to latest router model v2.4.',
    time: '3 hours ago',
    read: true,
    type: 'success',
  },
];

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const popoverRef = useRef<HTMLDivElement>(null);
  const profilePopoverRef = useRef<HTMLDivElement>(null);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profilePopoverRef.current && !profilePopoverRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showNotifications || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfileMenu]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleReadStatus = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    showSuccess('Logged out successfully. Returning to landing page...');
    navigate('/');
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    return true;
  });

  return (
    <header className="h-[68px] bg-white border-b border-line flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-30 shadow-xs">
      
      {/* Left section: Mobile menu toggle + Extended Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-3xl pr-4">
        {/* Hamburger - mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Extended Search Bar */}
        <div className="flex-1 w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <div className="relative flex items-center group">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 group-focus-within:text-blue-brand transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents, tasks, logs, or metrics..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-12 text-[13px] text-ink placeholder-slate-400 focus:outline-none focus:border-blue-brand focus:ring-2 focus:ring-blue-brand/15 focus:bg-white transition-all shadow-xs"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1 absolute right-3 pointer-events-none text-[10px] font-semibold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded-md">
                <span>⌘</span>
                <span>K</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Notifications + User Profile with Logout */}
      <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
        
        {/* Notifications Button & Interactive Dropdown */}
        <div className="relative" ref={popoverRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              showNotifications 
                ? 'bg-blue-50 text-blue-brand border border-blue-200 shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-brand border-2 border-white"></span>
              </span>
            )}
          </button>

          {/* Notification Popover Card */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              
              {/* Header */}
              <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#0F1B3D] text-sm sm:text-base">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-blue-100 text-blue-brand text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-blue-brand hover:text-blue-700 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeFilter === 'all'
                        ? 'bg-white text-blue-brand shadow-xs border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter('unread')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeFilter === 'unread'
                        ? 'bg-white text-blue-brand shadow-xs border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded"
                    title="Clear all notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {filteredNotifications.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Bell className="w-5 h-5 opacity-60" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">No notifications found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">You're all caught up for now!</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => toggleReadStatus(notification.id)}
                      className={`p-3.5 px-4 flex items-start gap-3 hover:bg-slate-50/80 cursor-pointer transition-colors relative group ${
                        !notification.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className="mt-0.5 flex-shrink-0">
                        {notification.type === 'success' && (
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                        {notification.type === 'warning' && (
                          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        )}
                        {notification.type === 'info' && (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Info className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className={`text-xs sm:text-sm truncate ${!notification.read ? 'font-bold text-[#0F1B3D]' : 'font-semibold text-slate-700'}`}>
                            {notification.title}
                          </h4>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 leading-snug line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notification.time}
                        </span>
                      </div>

                      {/* Unread Dot & Delete Action */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-brand" title="Unread"></span>
                        )}
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 transition-opacity"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 pt-2.5 pb-1 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  Real-time alerts active
                </span>
              </div>

            </div>
          )}
        </div>

        <div className="w-px h-6 bg-line hidden sm:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profilePopoverRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 text-left p-1.5 rounded-xl hover:bg-slate-100/80 transition-all focus:outline-none group cursor-pointer border border-transparent hover:border-slate-200"
            aria-label="User profile menu"
          >
            <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              V
            </div>
            <div className="hidden md:flex flex-col">
              <div className="text-[13px] font-semibold text-navy leading-tight group-hover:text-blue-brand transition-colors">Vedanti</div>
              <div className="text-[11px] text-slate-500 leading-none mt-0.5">Admin</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block group-hover:text-navy transition-colors" />
          </button>

          {/* Profile Dropdown Popover */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Details */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    V
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[#0F1B3D] truncate">Vedanti</div>
                    <div className="text-xs text-slate-500 truncate">vedanti@wanderly.ai</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-brand text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                        <Shield className="w-3 h-3" /> Admin Role
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown Options */}
              <div className="p-1.5 flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/dashboard/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Account Settings
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout (Back to Home)</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default Header;


