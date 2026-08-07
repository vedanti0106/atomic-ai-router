import React from 'react';
import heroFriends from '../assets/hero-friends.png';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-22 pb-0 overflow-visible">
      <div className="max-w-[1560px] mx-auto px-6 md:px-14 relative">
        {/* Plane doodle path */}
        <svg className="absolute top-[70px] left-[60px] w-[150px] opacity-85 hidden md:block" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 74C36 20 90 8 150 12" stroke="#0F1B3D" strokeWidth="1.4" strokeDasharray="4 5" />
          <path d="M150 12L140 8M150 12L146 20" stroke="#0F1B3D" strokeWidth="1.4" />
          <path d="M2 74L14 68L20 76L8 80Z" fill="#2F5FFF" />
        </svg>

        {/* Dots grid */}
        <div className="absolute top-[60px] left-[420px] hidden xl:block opacity-55">
          <div className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <span key={i} className="w-[5px] h-[5px] rounded-full bg-ink"></span>
            ))}
          </div>
        </div>

        {/* Decorative Rings */}
        <div className="absolute top-[60px] right-[590px] w-[70px] h-[70px] hidden xl:block">
          <div className="absolute w-[48px] h-[48px] rounded-full border border-line"></div>
          <div className="absolute w-[48px] h-[48px] rounded-full border border-line left-[22px] top-[14px]"></div>
        </div>

        <div className="absolute bottom-[-40px] left-[400px] w-[70px] h-[70px] hidden xl:block">
          <div className="absolute w-[48px] h-[48px] rounded-full border border-line"></div>
          <div className="absolute w-[48px] h-[48px] rounded-full border border-line left-[22px] top-[14px]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.15fr] gap-10 items-center">
          {/* Left Column (Copy) */}
          <div className="z-10">
            <p className="font-display uppercase tracking-[0.14em] text-[12.5px] font-semibold text-blue-brand mb-4">
              Explore more, spend less
            </p>
            <h1 className="text-[56px] md:text-[76px] font-bold leading-[0.98] text-navy uppercase font-display">
              <span className="block">Travel</span>
              <span className="block text-blue-brand">With Us</span>
            </h1>
            <p className="font-display font-semibold text-[17px] uppercase tracking-wide mt-6 leading-normal text-navy">
              With low price tickets<br />
              <span className="text-blue-brand">you can go anywhere</span>
            </p>
            <p className="mt-[22px] text-slate-500 text-[16px] leading-relaxed max-w-[430px]">
              Real fares, real people, real places you've been meaning to see. We cut the noise out of booking so your next trip starts in minutes, not tabs.
            </p>
            <div className="flex items-center gap-6 mt-[38px] flex-wrap">
              <button className="bg-navy text-white px-[38px] py-[19px] rounded-full font-semibold text-[15px] inline-flex items-center gap-[10px] hover:bg-blue-brand hover:-translate-y-0.5 transition-all shadow-md">
                <span>Get It Now</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-3 font-semibold text-[14.5px] cursor-pointer text-ink hover:text-blue-brand transition-colors">
                <div className="w-[38px] h-[38px] rounded-full border border-ink flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-ink">
                    <path d="M8 5V19L19 12L8 5Z" />
                  </svg>
                </div>
                <span>Watch Video</span>
              </div>
            </div>
          </div>

          {/* Right Column (Visual) */}
          <div className="relative flex justify-center z-10">
            {/* The Arch Frame */}
            <div className="relative w-full max-w-[560px] aspect-[560/620] rounded-t-[280px] rounded-b-[24px] border border-blue-brand p-[14px]">
              <img
                src={heroFriends}
                alt="Three friends sitting on a mountain ridge looking at the view"
                className="w-full h-full object-cover rounded-t-[270px] rounded-b-[16px]"
              />
              
              {/* Diamonds */}
              <div className="absolute w-[10px] h-[10px] bg-navy rotate-45 top-[34%] -left-[6px]"></div>
              <div className="absolute w-[10px] h-[10px] bg-navy rotate-45 bottom-[6%] -right-[6px]"></div>

              {/* Sparkle */}
              <div className="absolute top-[46%] -right-[42px] w-[26px] h-[26px] text-sand hidden md:block">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
                </svg>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute bg-white rounded-[18px] shadow-[0_20px_45px_rgba(15,27,61,0.14)] p-4 px-5 flex items-center gap-3 top-[26px] left-[-30px] z-20">
              <div className="w-10 h-10 rounded-[12px] bg-sky flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-blue-brand">
                  <path d="M12 2L14.5 8.5L21 9.5L16.5 14L17.5 21L12 17.5L6.5 21L7.5 14L3 9.5L9.5 8.5L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <b className="text-sm block leading-none">4.9 / 5</b>
                <span className="text-xs text-slate-500">Trip rating</span>
              </div>
            </div>

            <div className="absolute bg-white rounded-[18px] shadow-[0_20px_45px_rgba(15,27,61,0.14)] p-4 px-5 flex items-center gap-3 bottom-[52px] right-[-24px] z-20">
              <div className="w-10 h-10 rounded-[12px] bg-sky flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-blue-brand">
                  <path d="M3 12H21M3 12L9 6M3 12L9 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <b className="text-sm block leading-none">Cusco, Peru</b>
                <span className="text-xs text-slate-500">Booked 3 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
