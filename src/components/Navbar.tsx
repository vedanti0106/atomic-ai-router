import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/88 backdrop-blur-md border-b border-line">
      <nav className="max-w-[1560px] mx-auto px-6 md:px-14 flex items-center justify-between h-[88px]">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-[44px] h-[44px] rounded-full bg-navy flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M21 3L2 10.5L10.5 13.5L13.5 22L21 3Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-[19px] font-bold text-ink leading-tight">Wanderly</div>
            <div className="text-[11.5px] text-slate-500 tracking-wide">Explore more, spend less.</div>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="text-[14.5px] font-medium text-blue-brand relative pb-1.5 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-blue-brand after:rounded-[2px]">
            Home
          </a>
          <a href="#services" className="text-[14.5px] font-medium text-ink hover:text-blue-brand transition-colors pb-1.5">
            About
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

        {/* CTA */}
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 rounded-full border-[1.5px] border-blue-brand text-blue-brand font-semibold text-sm bg-transparent hover:bg-blue-brand hover:text-white transition-all">
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
