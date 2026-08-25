import React, { useState } from 'react';

export const WorkPage: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const works = [
    {
      id: 'w-1',
      title: 'Youth Chariot Procession on Village Tractor with Sri Krishna Idol',
      category: 'EVENTS',
      date: 'Janmashtami 2024',
      image: '/images/gallery/youth_tractor_ratham_procession.png',
      description: 'Organized grand tractor ratham procession decorated with yellow marigold garlands and Sri Krishna vigraham throughout Guraja streets.'
    },
    {
      id: 'w-2',
      title: 'Guraja Village Women Joyous Vasantotsavam & Holi Celebration',
      category: 'COMMUNITY',
      date: 'March 2024',
      image: '/images/gallery/guraja_women_holi_vasantotsavam.jpg',
      description: 'Celebrated traditional Vasantotsavam with organic colors, devotional songs, and cultural togetherness among Guraja families.'
    },
    {
      id: 'w-3',
      title: 'Sri Krishna Swamy in Golden Arch (Prabhavali) Alankaram',
      category: 'CULTURAL',
      date: 'April 2024',
      image: '/images/gallery/krishna_swamy_golden_arch.jpg',
      description: 'Installed decorative golden Prabhavali arch and performed sacred alankaram at Sri Krishna Mandiram.'
    },
    {
      id: 'w-4',
      title: 'Guraja Youth Procession & Heritage Motorcycle Rally',
      category: 'YOUTH',
      date: 'April 2024',
      image: '/images/gallery/guraja_youth_procession_rally.png',
      description: 'Conducted grand youth flag rally across the village to promote brotherhood, cultural pride, and youth unity.'
    },
    {
      id: 'w-5',
      title: 'Guraja Night Utsavam & High-Power Sound Lighting Rally',
      category: 'EVENTS',
      date: 'May 2024',
      image: '/images/gallery/guraja_night_utsav_sound_rally.png',
      description: 'Organized vibrant night utsav with laser lighting, sound systems, and youth devotional bhajan processions.'
    },
    {
      id: 'w-6',
      title: 'Devi Navaratri Mahotsavam & Dussehra Youth Seva',
      category: 'CULTURAL',
      date: 'October 2024',
      image: '/images/gallery/devi_navaratri_guraja_banner.jpg',
      description: 'Coordinated the annual 9-day Navaratri celebrations, kumkum puja, and youth volunteer security management.'
    }
  ];

  const categories = [
    { id: 'ALL', label: 'All' },
    { id: 'EVENTS', label: 'Events' },
    { id: 'COMMUNITY', label: 'Community' },
    { id: 'CULTURAL', label: 'Cultural' },
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
            Discover verified community celebrations and youth projects executed in Guraja.
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
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={w.image}
                    alt={w.title}
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
