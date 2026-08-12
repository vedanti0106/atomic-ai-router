import React from 'react';
import { Link } from 'react-router-dom';

const SearchSection: React.FC = () => {
  return (
    <section className="bg-sky mt-[70px] pt-[130px]">
      <div className="max-w-[1560px] mx-auto px-6 md:px-14">
        {/* Floating Search Card */}
        <div className="bg-white rounded-[24px] shadow-[0_30px_60px_rgba(15,27,61,0.12)] p-[26px] px-[30px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.1fr_1px_1.1fr_1px_1fr_1px_1fr_auto] items-center gap-[26px] -mt-[118px] relative z-20">
          
          {/* Destination */}
          <div className="flex items-center gap-[14px]">
            <div className="w-[46px]. h-[46px] w-[46px] h-[46px] rounded-[14px] bg-sky flex items-center justify-center flex-shrink-0 text-blue-brand">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 21C12 21 19 14.5 19 9.5C19 5.36 15.64 2 12 2C8.36 2 5 5.36 5 9.5C5 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Where to?</div>
              <div className="text-[13px] text-slate-500 mt-[2px]">Ex: Goa, Bali, Paris</div>
            </div>
          </div>

          <div className="hidden xl:block w-[1px] h-[44px] bg-line"></div>

          {/* Dates */}
          <div className="flex items-center gap-[14px]">
            <div className="w-[46px] h-[46px] rounded-[14px] bg-sky flex items-center justify-center flex-shrink-0 text-blue-brand">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3 9H21M8 3V6M16 3V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Check In - Out</div>
              <div className="text-[13px] text-slate-500 mt-[2px]">Add dates</div>
            </div>
          </div>

          <div className="hidden xl:block w-[1px] h-[44px] bg-line"></div>

          {/* Travellers */}
          <div className="flex items-center gap-[14px]">
            <div className="w-[46px] h-[46px] rounded-[14px] bg-sky flex items-center justify-center flex-shrink-0 text-blue-brand">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4.5 20C5.5 16 8.4 14 12 14C15.6 14 18.5 16 19.5 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Travellers</div>
              <div className="text-[13px] text-slate-500 mt-[2px]">2 Adults, 1 Child</div>
            </div>
          </div>

          <div className="hidden xl:block w-[1px] h-[44px] bg-line"></div>

          {/* Budget */}
          <div className="flex items-center gap-[14px]">
            <div className="w-[46px] h-[46px] rounded-[14px] bg-sky flex items-center justify-center flex-shrink-0 text-blue-brand">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 2V22M17 5.5C17 3.6 14.8 2 12 2C9.2 2 7 3.6 7 5.5C7 9.5 17 8 17 12C17 14 14.8 15.5 12 15.5C9.2 15.5 7 14 7 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Budget</div>
              <div className="text-[13px] text-slate-500 mt-[2px]">Up to $1,500</div>
            </div>
          </div>

          {/* Button */}
          <Link to="/dashboard" className="bg-blue-brand hover:bg-blue-dark text-white rounded-[16px] padding-[18px_30px] h-[56px] px-[30px] font-semibold text-[15px] flex items-center justify-center gap-[10px] white-space-nowrap transition-colors w-full xl:w-auto mt-4 xl:mt-0">
            <span>Explore Now</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="1.8" />
              <path d="M20 20L16.5 16.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
