import React, { useState } from 'react';
import { Award, CheckCircle2, Calendar, MapPin } from 'lucide-react';

export const WorkPage: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const works = [
    {
      id: 'w-1',
      title: 'Food Distribution & Annadanam Seva Drive',
      category: 'COMMUNITY',
      date: 'May 2024',
      image: '/images/gallery/annadanam_prasad_distribution.png',
      fallbackImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
      description: 'Distributed nutritious cooked meals and prasad to over 2,500 villagers and elderly residents during temple festival.'
    },
    {
      id: 'w-2',
      title: 'Green Guraja 1,000 Tree Plantation Drive',
      category: 'ENVIRONMENT',
      date: 'April 2024',
      image: '/images/gallery/tree_plantation_drive.png',
      fallbackImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
      description: 'Planted native shade trees and neem saplings along village entrance roads with drip protection tree guards.'
    },
    {
      id: 'w-3',
      title: 'Free Mega Medical & Health Screening Camp',
      category: 'HEALTH',
      date: 'April 2024',
      image: '/images/gallery/medical_camp_doctors.png',
      fallbackImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
      description: 'Provided free health checkups, blood pressure monitoring, eye tests, and medicines for 450+ village elders.'
    },
    {
      id: 'w-4',
      title: 'Guraja Youth Premier League Sports Tournament',
      category: 'YOUTH',
      date: 'March 2024',
      image: '/images/gallery/youth_sports_cricket_tournament.png',
      fallbackImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
      description: 'Organized inter-hamlet cricket and kabaddi tournaments to encourage youth sportsmanship, fitness, and solidarity.'
    },
    {
      id: 'w-5',
      title: 'RO Drinking Water Plant Membrane Upkeep',
      category: 'COMMUNITY',
      date: 'February 2024',
      image: '/images/gallery/guraja_ro_plant_field.png',
      fallbackImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
      description: 'Replaced multi-stage sand filters and reverse osmosis membranes to guarantee 100% clean drinking water.'
    },
    {
      id: 'w-6',
      title: 'Youth Community Study Hall Desks Setup',
      category: 'EDUCATION',
      date: 'January 2024',
      image: '/images/gallery/youth_study_hall_library.png',
      fallbackImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
      description: 'Equipped the Yadav Youth Bhavan study hall with LED lighting, reference encyclopedias, and high-speed Wi-Fi.'
    }
  ];

  const categories = [
    { id: 'ALL', label: 'All' },
    { id: 'EDUCATION', label: 'Education' },
    { id: 'ENVIRONMENT', label: 'Environment' },
    { id: 'COMMUNITY', label: 'Community' },
    { id: 'YOUTH', label: 'Youth' }
  ];

  const filtered = filterCategory === 'ALL'
    ? works
    : works.filter((w) => w.category === filterCategory);

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            COMPLETED IMPACT
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            OUR INITIATIVES
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Discover the verified community projects executed by Sri Krishna Yadav Youth Guraja.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat.id
                  ? 'bg-[#D4A244] text-slate-950 shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={w.image}
                    alt={w.title}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = w.fallbackImage;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800 uppercase shadow">
                    {w.date}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#D4A244] border border-amber-200 uppercase">
                    {w.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {w.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {w.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Location: Guraja, AP</span>
                <span className="text-emerald-600 font-medium">✓ Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkPage;
