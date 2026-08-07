import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-white pt-20" id="footer">
      <div className="max-w-[1560px] mx-auto px-6 md:px-14">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr] gap-10 pb-[60px] border-b border-white/12">
          
          {/* Brand & Social */}
          <div className="footer-brand">
            <div className="flex items-center gap-3">
              <div className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center flex-shrink-0 text-navy">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M21 3L2 10.5L10.5 13.5L13.5 22L21 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[19px] font-bold text-white font-display">Wanderly</span>
            </div>
            <p className="text-white/60 text-[14px] mt-4 leading-relaxed max-w-[280px]">
              Real fares, real people, real places. We've helped 10,000+ travellers get out the door for less since day one.
            </p>
            <div className="flex gap-3.5 mt-[22px]">
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 fill-white">
                  <path d="M18 2H15C13.4 2 12 3.4 12 5V8H9V12H12V22H16V12H19L20 8H16V6C16 5.4 16.4 5 17 5H20V2Z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 fill-white">
                  <path d="M22 5.9C21.3 6.2 20.5 6.4 19.7 6.5C20.5 6 21.2 5.2 21.5 4.2C20.7 4.7 19.9 5 19 5.2C18.3 4.4 17.3 4 16.2 4C14.1 4 12.4 5.7 12.4 7.8C12.4 8.1 12.4 8.4 12.5 8.7C9.3 8.5 6.5 7 4.6 4.6C4.3 5.2 4.1 5.9 4.1 6.6C4.1 8 4.8 9.2 5.9 9.9C5.2 9.9 4.6 9.7 4.1 9.4V9.5C4.1 11.3 5.4 12.8 7.1 13.2C6.8 13.3 6.4 13.3 6.1 13.3C5.9 13.3 5.6 13.3 5.4 13.2C5.9 14.7 7.3 15.8 9 15.8C7.7 16.8 6.1 17.4 4.3 17.4C4 17.4 3.7 17.4 3.4 17.3C5.1 18.4 7.1 19 9.3 19C16.2 19 20 13.3 20 8.4V7.9C20.7 7.4 21.4 6.7 22 5.9Z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-white" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[13px] text-white/50 uppercase tracking-[0.08em] font-semibold mb-[18px]">Company</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">About us</a>
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Careers</a>
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Press</a>
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Blog</a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[13px] text-white/50 uppercase tracking-[0.08em] font-semibold mb-[18px]">Explore</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Destinations</a>
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Deals</a>
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Group travel</a>
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Gift cards</a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[13px] text-white/50 uppercase tracking-[0.08em] font-semibold mb-[18px]">Support</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Help centre</a>
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Cancellations</a>
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Travel insurance</a>
              <a href="#" className="text-[14.5px] text-white/85 hover:text-sand transition-colors">Contact us</a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[13px] text-white/50 uppercase tracking-[0.08em] font-semibold mb-[18px]">Get trip tips</h4>
            <p className="text-white/60 text-[13.5px] mb-3.5 leading-relaxed">
              Fare drops and route guides, once a week.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/8 border border-white/20 rounded-[10px] p-[11px] px-[14px] text-white text-[13px] placeholder-white/40 focus:outline-none focus:border-white/50"
              />
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-[26px] text-[13px] text-white/50 gap-4">
          <span>© 2026 Wanderly. All rights reserved.</span>
          <span>Privacy · Terms · Sitemap</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
