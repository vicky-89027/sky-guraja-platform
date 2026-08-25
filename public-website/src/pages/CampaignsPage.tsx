import React, { useState } from 'react';
import { Heart, Calendar, Target, Users, Filter, CheckCircle2, ArrowRight } from 'lucide-react';

interface CampaignsPageProps {
  onOpenDonate: (campaignName?: string) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ onOpenDonate }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const campaigns = [
    {
      id: 'cmp-1',
      name: 'Education for All',
      category: 'EDUCATION',
      image: '/images/gallery/youth_study_hall_library.png',
      fallbackImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
      description: 'Support quality education, tuition assistance, and competitive exam books for underprivileged students in Guraja.',
      target_amount: 200000,
      collected_amount: 125000,
      percentage: 62.5
    },
    {
      id: 'cmp-2',
      name: 'Healthcare Support',
      category: 'HEALTH',
      image: '/images/gallery/village_youth_social_service.png',
      fallbackImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      description: 'Provide essential healthcare aid, quarterly blood donation camps, and emergency ambulance fund for villagers.',
      target_amount: 150000,
      collected_amount: 75000,
      percentage: 50
    },
    {
      id: 'cmp-3',
      name: 'Youth Empowerment',
      category: 'YOUTH',
      image: '/images/gallery/youth_sports_cricket_tournament.png',
      fallbackImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      description: 'Skill training, vocational career workshops, computer lab access, and sports tournaments for Guraja youth brigade.',
      target_amount: 200000,
      collected_amount: 90000,
      percentage: 45
    },
    {
      id: 'cmp-4',
      name: 'Community Development',
      category: 'COMMUNITY',
      image: '/images/gallery/guraja_ro_plant_field.png',
      fallbackImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
      description: 'Maintenance of Guraja clean drinking water RO plant and solar street light installations across village streets.',
      target_amount: 300000,
      collected_amount: 210000,
      percentage: 70
    },
    {
      id: 'cmp-5',
      name: 'Sri Krishna Janmashtami Celebration',
      category: 'COMMUNITY',
      image: '/images/gallery/krishna_swamy_golden_arch.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
      description: 'Grand Utlotsavam (Dahi Handi), devotional bhajans, cultural youth drama, and Annadanam for 2500+ devotees.',
      target_amount: 250000,
      collected_amount: 195000,
      percentage: 78
    },
    {
      id: 'cmp-6',
      name: 'Green Guraja Tree Plantation Drive',
      category: 'ENVIRONMENT',
      image: '/images/gallery/tree_plantation_drive.png',
      fallbackImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
      description: 'Planting and nurturing 1,000+ shade trees, fruit saplings, and medicinal plants along Guraja village roads.',
      target_amount: 80000,
      collected_amount: 80000,
      percentage: 100
    }
  ];

  const categories = [
    { id: 'ALL', label: 'All' },
    { id: 'EDUCATION', label: 'Education' },
    { id: 'HEALTH', label: 'Health' },
    { id: 'COMMUNITY', label: 'Community' },
    { id: 'YOUTH', label: 'Youth' },
    { id: 'ENVIRONMENT', label: 'Environment' }
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
            Explore and support active community development programs in Guraja village.
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
                {/* Image Banner */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = c.fallbackImage;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800 uppercase shadow">
                    {c.category}
                  </div>
                </div>

                {/* Info */}
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
                {/* Progress Bar & Numbers */}
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
