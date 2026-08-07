import React from 'react';

const Services: React.FC = () => {
  return (
    <section className="py-24 bg-navy text-white" id="services">
      <div className="max-w-[1560px] mx-auto px-6 md:px-14">
        {/* Section Head */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-[52px]">
          <div>
            <p className="font-display uppercase tracking-[0.14em] text-[12.5px] font-semibold text-sand mb-4">
              Why Wanderly
            </p>
            <h2 className="text-[32px] md:text-[42px] font-bold text-white uppercase font-display leading-[1.1] max-w-[560px]">
              Everything a good trip needs, nothing it doesn't
            </h2>
          </div>
          <p className="text-white/65 text-[15.5px] leading-relaxed max-w-[380px]">
            No hidden fees, no dead-end searches — just the fastest way from "I want to go" to "I'm there."
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/14 rounded-[24px] overflow-hidden">
          {/* Card 1 */}
          <div className="bg-navy p-[42px] px-[32px]">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-white/8 flex items-center justify-center mb-[26px]">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-sand">
                <path d="M3 9.5L14.5 3L21 8.5L9.5 21L3 15V9.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold uppercase mb-[10px] font-display">Lowest Fares</h3>
            <p className="text-[14px] text-white/60 leading-relaxed">
              We track prices across 200+ airlines so you always book at the dip, not the peak.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-navy p-[42px] px-[32px]">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-white/8 flex items-center justify-center mb-[26px]">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-sand">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3 9H21" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold uppercase mb-[10px] font-display">Flexible Dates</h3>
            <p className="text-[14px] text-white/60 leading-relaxed">
              Shift a booking without the phone call — change dates in two taps, no fee under 48h.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-navy p-[42px] px-[32px]">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-white/8 flex items-center justify-center mb-[26px]">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-sand">
                <path d="M4 14V11C4 6.6 7.6 3 12 3C16.4 3 20 6.6 20 11V14" stroke="currentColor" strokeWidth="1.6" />
                <rect x="2" y="13" width="5" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold uppercase mb-[10px] font-display">Real Human Support</h3>
            <p className="text-[14px] text-white/60 leading-relaxed">
              A person, not a bot, answers within minutes — day or night, wherever you've landed.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-navy p-[42px] px-[32px]">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-white/8 flex items-center justify-center mb-[26px]">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-sand">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 7V12L15.5 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold uppercase mb-[10px] font-display">Book in Minutes</h3>
            <p className="text-[14px] text-white/60 leading-relaxed">
              Search, compare, and confirm without ever leaving the page — no redirect maze.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
