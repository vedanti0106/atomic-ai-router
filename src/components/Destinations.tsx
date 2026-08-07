import React from 'react';

interface Destination {
  image: string;
  price: string;
  title: string;
  desc: string;
}

const destinations: Destination[] = [
  {
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    price: 'From $349',
    title: 'Bali, Indonesia',
    desc: 'Rice terraces & surf towns',
  },
  {
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    price: 'From $412',
    title: 'Paris, France',
    desc: 'Cafés, art & river walks',
  },
  {
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    price: 'From $528',
    title: 'Santorini, Greece',
    desc: 'Cliffside sunsets',
  },
  {
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    price: 'From $601',
    title: 'Tokyo, Japan',
    desc: 'Neon streets & quiet shrines',
  },
];

const Destinations: React.FC = () => {
  return (
    <section className="py-24" id="destinations">
      <div className="max-w-[1560px] mx-auto px-6 md:px-14">
        {/* Section Head */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-[52px]">
          <div>
            <p className="font-display uppercase tracking-[0.14em] text-[12.5px] font-semibold text-blue-brand mb-4">
              Where next
            </p>
            <h2 className="text-[32px] md:text-[42px] font-bold text-navy uppercase font-display leading-[1.1] max-w-[560px]">
              Popular destinations, picked by our travellers
            </h2>
          </div>
          <p className="text-slate-500 text-[15.5px] leading-relaxed max-w-[380px]">
            From misty ridgelines to whitewashed coastlines — these are the trips people rebook the following year.
          </p>
        </div>

        {/* Dest Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <div key={index} className="relative rounded-[22px] overflow-hidden aspect-[3/4] group shadow-[0_18px_40px_rgba(15,27,61,0.10)]">
              <img
                src={dest.image}
                alt={dest.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/82 via-transparent to-transparent flex flex-col justify-end p-[22px]">
                <span className="self-start bg-white text-navy text-[12px] font-bold px-[14px] py-[6px] rounded-full mb-auto shadow-sm">
                  {dest.price}
                </span>
                <h3 className="text-white text-[21px] font-bold uppercase font-display">
                  {dest.title}
                </h3>
                <span className="text-white/75 text-[13px] mt-0.5">
                  {dest.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
