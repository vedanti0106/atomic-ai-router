import React from 'react';

const Statistics: React.FC = () => {
  return (
    <section className="bg-sky pb-[84px] pt-[64px]">
      <div className="max-w-[1560px] mx-auto px-6 md:px-14">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-5 items-center">
          
          {/* Stat 1 */}
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <circle cx="8" cy="9" r="3" stroke="#fff" strokeWidth="1.6" />
                <circle cx="16" cy="9" r="3" stroke="#fff" strokeWidth="1.6" />
                <path d="M2 20C2.6 16.6 5 15 8 15C11 15 13.4 16.6 14 20" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M14 15C16.6 15 19 16.6 20 20" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <b className="text-[23px] font-bold text-navy font-display leading-tight">10K+</b>
              <span className="text-[13.5px] text-slate-500 block leading-tight">Happy Travellers</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M3 9.5L14.5 3L21 8.5L9.5 21L3 15V9.5Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
                <circle cx="15.5" cy="8.5" r="1.4" fill="#fff" />
              </svg>
            </div>
            <div>
              <b className="text-[23px] font-bold text-navy font-display leading-tight">150K+</b>
              <span className="text-[13.5px] text-slate-500 block leading-tight">Tickets Booked</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.6" />
                <path d="M3 12H21M12 3C14.5 6 14.5 18 12 21M12 3C9.5 6 9.5 18 12 21" stroke="#fff" strokeWidth="1.6" />
              </svg>
            </div>
            <div>
              <b className="text-[23px] font-bold text-navy font-display leading-tight">50+</b>
              <span className="text-[13.5px] text-slate-500 block leading-tight">Top Destinations</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M4 14V11C4 6.6 7.6 3 12 3C16.4 3 20 6.6 20 11V14" stroke="#fff" strokeWidth="1.6" />
                <rect x="2" y="13" width="5" height="6" rx="1.5" stroke="#fff" strokeWidth="1.6" />
                <rect x="17" y="13" width="5" height="6" rx="1.5" stroke="#fff" strokeWidth="1.6" />
              </svg>
            </div>
            <div>
              <b className="text-[23px] font-bold text-navy font-display leading-tight">24/7</b>
              <span className="text-[13.5px] text-slate-500 block leading-tight">Support Available</span>
            </div>
          </div>

          {/* Stat 5 */}
          <div className="flex items-center gap-4 col-span-2 md:col-span-1 justify-center md:justify-start">
            <div className="w-[56px] h-[56px] rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M12 2L14.5 8.5L21 9.5L16.5 14L17.5 21L12 17.5L6.5 21L7.5 14L3 9.5L9.5 8.5L12 2Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <b className="text-[23px] font-bold text-navy font-display leading-tight">4.9</b>
              <span className="text-[13.5px] text-slate-500 block leading-tight">Average Rating</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Statistics;
