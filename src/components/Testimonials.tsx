import React from 'react';

interface Testimonial {
  stars: number;
  text: string;
  avatar: string;
  name: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    stars: 5,
    text: '"Booked a flight to Lisbon on my lunch break — cheaper than what I\'d found after a week of searching elsewhere."',
    avatar: 'https://i.pravatar.cc/100?img=32',
    name: 'Maren K.',
    location: 'Booked: Lisbon, Portugal',
  },
  {
    stars: 5,
    text: '"Our flight got cancelled at 11pm and a real person rebooked us within ten minutes. Never happened with any other site."',
    avatar: 'https://i.pravatar.cc/100?img=15',
    name: 'Ravi S.',
    location: 'Booked: Bali, Indonesia',
  },
  {
    stars: 5,
    text: '"The budget filter actually works — showed me trips I could afford instead of the usual bait-and-switch pricing."',
    avatar: 'https://i.pravatar.cc/100?img=48',
    name: 'Elin T.',
    location: 'Booked: Santorini, Greece',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24">
      <div className="max-w-[1560px] mx-auto px-6 md:px-14">
        {/* Section Head */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-[52px]">
          <div>
            <p className="font-display uppercase tracking-[0.14em] text-[12.5px] font-semibold text-blue-brand mb-4">
              Traveller stories
            </p>
            <h2 className="text-[32px] md:text-[42px] font-bold text-navy uppercase font-display leading-[1.1] max-w-[560px]">
              Trips they're still talking about
            </h2>
          </div>
          <p className="text-slate-500 text-[15.5px] leading-relaxed max-w-[380px]">
            A few notes from people who booked, packed, and went.
          </p>
        </div>

        {/* Testi Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((testi, index) => (
            <div key={index} className="bg-sky rounded-[22px] p-[34px] flex flex-col gap-5 justify-between">
              <div>
                <div className="text-sand text-sm tracking-[2px] mb-4">
                  {'★'.repeat(testi.stars)}
                </div>
                <p className="text-[15px] leading-relaxed text-ink font-medium">
                  {testi.text}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-auto">
                <img
                  className="w-[44px] h-[44px] rounded-full object-cover"
                  src={testi.avatar}
                  alt={testi.name}
                />
                <div>
                  <b className="text-[14px] block font-bold text-ink leading-none">{testi.name}</b>
                  <span className="text-[12.5px] text-slate-500">{testi.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
