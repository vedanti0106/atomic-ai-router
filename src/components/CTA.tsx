import React from 'react';
import { Link } from 'react-router-dom';

const CTA: React.FC = () => {
  return (
    <section className="py-24 pt-0">
      <div className="max-w-[1560px] mx-auto px-6 md:px-14">
        <div className="bg-blue-brand rounded-[32px] p-[70px] flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
          {/* Plane doodle path */}
          <svg className="absolute right-[60px] top-[-20px] w-[120px] opacity-25" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 74C36 20 90 8 150 12" stroke="#fff" strokeWidth="1.4" strokeDasharray="4 5" />
            <path d="M2 74L14 68L20 76L8 80Z" fill="#fff" />
          </svg>
          
          <h2 className="text-white text-[32px] md:text-[36px] font-bold uppercase font-display leading-[1.15] max-w-[520px]">
            Your next trip is closer<br />than you think.
          </h2>
          
          <Link
            to="/dashboard"
            className="bg-white text-navy px-[38px] py-[19px] rounded-full font-semibold text-[15px] inline-flex items-center gap-[10px] hover:bg-sand hover:text-white transition-all shadow-md shrink-0"
          >
            <span>Start Exploring</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
