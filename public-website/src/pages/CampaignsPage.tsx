import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Target, Users, Filter, CheckCircle2 } from 'lucide-react';

interface CampaignsPageProps {
  onOpenDonate: (campaignName?: string) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ onOpenDonate }) => {
  const [campaigns, setCampaigns] = useState<any[]>([
    {
      id: 'cmp-1',
      name: 'Sri Krishna Janmashtami 2026 Grand Celebration',
      category: 'FESTIVAL',
      description: 'Annadanam for 2500+ villagers, grand Utlotsavam (Dahi Handi), devotional bhajans, prize distribution for youth merit scholars, and cultural programs.',
      target_amount: 250000,
      collected_amount: 50000,
      start_date: '2026-07-01',
      end_date: '2026-08-31',
      status: 'ACTIVE'
    },
    {
      id: 'cmp-2',
      name: 'Youth Community Study Hall & Digital Library',
      category: 'EDUCATION',
      description: 'Setting up an air-conditioned study hall with high-speed fiber internet, competitive exam preparation material (UPSC, APPSC, SSC, Banking), and modern study desks for Guraja students.',
      target_amount: 150000,
      collected_amount: 30000,
      start_date: '2026-06-01',
      end_date: '2026-10-31',
      status: 'ACTIVE'
    },
    {
      id: 'cmp-3',
      name: 'Guraja Clean Drinking Water (RO Plant Maintenance)',
      category: 'COMMUNITY_DEVELOPMENT',
      description: 'Annual filter membrane replacement and mineral replenishment for Guraja RO drinking water plant serving over 600 village households daily with clean potable water.',
      target_amount: 50000,
      collected_amount: 50000,
      start_date: '2026-05-01',
      end_date: '2026-08-15',
      status: 'COMPLETED'
    },
    {
      id: 'cmp-4',
      name: 'Emergency Medical Aid & Youth Blood Donation Wing',
      category: 'HEALTHCARE',
      description: 'Creating an emergency medical contingency fund for Guraja families requiring urgent hospitalization, ambulance assistance, and organizing quarterly blood donation camps.',
      target_amount: 100000,
      collected_amount: 15000,
      start_date: '2026-08-01',
      end_date: '2026-12-31',
      status: 'ACTIVE'
    }
  ]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    fetch('http://localhost:5000/api/public/transparency')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.campaigns?.length > 0) {
          setCampaigns(res.data.campaigns);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['ALL', 'FESTIVAL', 'EDUCATION', 'COMMUNITY_DEVELOPMENT', 'HEALTHCARE'];

  const filtered = filterCategory === 'ALL'
    ? campaigns
    : campaigns.filter((c) => c.category === filterCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Community Campaigns & Initiatives
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Support verified village initiatives. Every contribution is directly credited to the public ledger and issued an official cryptographic receipt.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              filterCategory === cat
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-[#0B1B36] text-slate-300 border-white/10 hover:border-amber-500/30'
            }`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((c) => {
          const pct = Math.min(Math.round((c.collected_amount / c.target_amount) * 100), 100);
          const isCompleted = c.status === 'COMPLETED' || pct >= 100;

          return (
            <div
              key={c.id}
              className="p-6 bg-[#0B1B36] border border-white/10 rounded-3xl space-y-5 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                    {c.category.replace(/_/g, ' ')}
                  </span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>100% Funded</span>
                    </span>
                  ) : (
                    <span className="font-mono text-emerald-400 font-bold text-xs">
                      {pct}% Achieved
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{c.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isCompleted
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-amber-500 to-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Collected: <b className="text-white">₹{Number(c.collected_amount).toLocaleString('en-IN')}</b></span>
                  <span>Target: <b className="text-amber-300">₹{Number(c.target_amount).toLocaleString('en-IN')}</b></span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Until: {c.end_date || '2026-12-31'}</span>
                  </span>
                  <span className="text-emerald-400 font-medium">Verified Ledger ID: #{c.id}</span>
                </div>

                <button
                  onClick={() => onOpenDonate(c.name)}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isCompleted
                      ? 'bg-[#16335F] text-slate-300 hover:bg-[#1E437C]'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{isCompleted ? 'Contribute Extra Surplus' : 'Support this Campaign'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
