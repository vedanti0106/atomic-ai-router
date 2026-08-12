import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-line">
      <nav className="max-w-[1560px] mx-auto px-4 md:px-14 flex items-center justify-between h-[72px] md:h-[88px]">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] rounded-full bg-navy flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M21 3L2 10.5L10.5 13.5L13.5 22L21 3Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-[17px] md:text-[19px] font-bold text-ink leading-tight">AI Router</div>
            <div className="text-[11px] text-slate-500 tracking-wide hidden sm:block">Atomic Multi-Agent Platform</div>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="text-[14.5px] font-medium text-blue-brand relative pb-1.5 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-blue-brand after:rounded-[2px]">
            Home
          </a>
          <a href="#services" className="text-[14.5px] font-medium text-ink hover:text-blue-brand transition-colors pb-1.5">
            Services
          </a>
          <a href="#destinations" className="text-[14.5px] font-medium text-ink hover:text-blue-brand transition-colors pb-1.5">
            Destinations
          </a>
          <a href="#footer" className="text-[14.5px] font-medium text-ink hover:text-blue-brand transition-colors pb-1.5">
            Contact
          </a>
        </div>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-xs font-semibold text-navy">{user.name}</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                  ${user.balance.toFixed(2)} USDC
                </span>
              </div>
              <Link
                to="/dashboard"
                className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-navy text-white font-semibold text-[13px] md:text-sm hover:opacity-90 transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:block px-5 py-2.5 rounded-full border-[1.5px] border-rose-500 text-rose-500 font-semibold text-sm bg-transparent hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-navy text-white font-semibold text-[13px] md:text-sm hover:opacity-90 transition-all text-center"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hidden md:block px-6 py-2.5 rounded-full border-[1.5px] border-blue-brand text-blue-brand font-semibold text-sm bg-transparent hover:bg-blue-brand hover:text-white transition-all text-center"
              >
                Sign Up
              </Link>
            </>
          )}
          {/* Hamburger - mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-[10px] hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-line px-4 py-4 flex flex-col gap-3">
          <a href="#" onClick={() => setMenuOpen(false)} className="text-[15px] font-semibold text-blue-brand py-2 border-b border-line/50">Home</a>
          <a href="#services" onClick={() => setMenuOpen(false)} className="text-[15px] font-medium text-navy py-2 border-b border-line/50">Services</a>
          <a href="#destinations" onClick={() => setMenuOpen(false)} className="text-[15px] font-medium text-navy py-2 border-b border-line/50">Destinations</a>
          <a href="#footer" onClick={() => setMenuOpen(false)} className="text-[15px] font-medium text-navy py-2 border-b border-line/50">Contact</a>
          {user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between px-2 py-1 text-sm">
                <span className="font-semibold text-navy">{user.name}</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  ${user.balance.toFixed(2)} USDC
                </span>
              </div>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full py-2.5 rounded-full border-[1.5px] border-rose-500 text-rose-500 font-semibold text-sm bg-transparent hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              onClick={() => setMenuOpen(false)}
              className="mt-2 w-full py-2.5 rounded-full border-[1.5px] border-blue-brand text-blue-brand font-semibold text-sm bg-transparent hover:bg-blue-brand hover:text-white transition-all text-center"
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}

    </header>
  );
};

export default Navbar;
