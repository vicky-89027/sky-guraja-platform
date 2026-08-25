import React, { useState } from 'react';

interface CampaignsPageProps {
  onOpenDonate: (campaignName?: string) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ onOpenDonate }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const campaigns = [
    {
      id: 'cmp-1',
      name: 'Sri Krishna Janmashtami & Utlotsavam Mahotsavam',
      category: 'FESTIVAL',
      image: '/images/gallery/radha_krishna_janmashtami_banner.jpg',
      description: 'Grand Utlotsavam (Dahi Handi), devotional bhajans, cultural youth drama, and Annadanam for 2500+ devotees.',
      target_amount: 250000,
      collected_amount: 195000,
      percentage: 78
    },
    {
      id: 'cmp-2',
      name: 'Guraja Youth Community Seva & Village Upliftment',
      category: 'COMMUNITY',
      image: '/images/gallery/guraja_youth_volunteers_group.png',
      description: 'Youth solidarity drives, RO clean drinking water maintenance, and village development programs in Guraja.',
      target_amount: 300000,
      collected_amount: 210000,
      percentage: 70
    },
    {
      id: 'cmp-3',
      name: 'Sri Krishna Swamy Temple Arch & Mandir Alankaram',
      category: 'FESTIVAL',
      image: '/images/gallery/krishna_swamy_golden_arch.jpg',
      description: 'Golden Prabhavali arch installation, sanctum deepam lighting, and heritage mandir upkeep in Guraja.',
      target_amount: 200000,
      collected_amount: 125000,
      percentage: 62.5
    },
    {
      id: 'cmp-4',
      name: 'Devi Navaratri Mahotsavam & Cultural Drives',
      category: 'CULTURAL',
      image: '/images/gallery/devi_navaratri_guraja_banner.jpg',
      description: 'Annual village Dussehra & Navaratri celebrations, kumkumarchana, and special prasadam distribution.',
      target_amount: 150000,
      collected_amount: 90000,
      percentage: 60
    },
    {
      id: 'cmp-5',
      name: 'Guraja Youth Tractor Ratham Procession',
      category: 'YOUTH',
      image: '/images/gallery/youth_tractor_ratham_procession.png',
      description: 'Chariot tractor floral decoration, sound lighting equipment, and youth volunteers rally coordination.',
      target_amount: 120000,
      collected_amount: 120000,
      percentage: 100
    },
    {
      id: 'cmp-6',
      name: 'Community Social Welfare & Birthday Charity Drive',
      category: 'COMMUNITY',
      image: '/images/gallery/suriya_birthday_guraja_banner.jpg',
      description: 'Social welfare distribution, fruits & clothes for village elders, and student merit encouragement.',
      target_amount: 80000,
      collected_amount: 80000,
      percentage: 100
    }
  ];

  const categories = [
    { id: 'ALL', label: 'All' },
    { id: 'FESTIVAL', label: 'Festival' },
    { id: 'COMMUNITY', label: 'Community' },
    { id: 'YOUTH', label: 'Youth' },
    { id: 'CULTURAL', label: 'Cultural' }
  ];

  const filtered = filterCategory === 'ALL'
    ? campaigns
    : campaigns.filter((c) => c.category === filterCategory);

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            COMMUNITY INITIATIVES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            ALL CAMPAIGNS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Explore and support authentic community and cultural programs in Guraja village.
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

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800 uppercase shadow">
                    {c.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-lg leading-snug">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold text-slate-800">
                      ₹{c.collected_amount.toLocaleString('en-IN')} / <span className="text-slate-400">₹{c.target_amount.toLocaleString('en-IN')}</span>
                    </span>
                    <span className="font-bold text-slate-600">{c.percentage}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        c.percentage >= 100 ? 'bg-emerald-500' : 'bg-[#D4A244]'
                      }`}
                      style={{ width: `${Math.min(c.percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => onOpenDonate(c.name)}
                  className="w-full py-3 bg-[#D4A244] hover:bg-[#C49132] text-slate-950 font-black text-xs tracking-wider uppercase rounded-xl shadow-md transition-all text-center"
                >
                  SUPPORT NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
