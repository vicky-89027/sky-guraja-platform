import React, { useState } from 'react';
import { SkyLogo } from '../components/SkyLogo';
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Users,
  Coins,
  TrendingUp,
  Heart,
  ShieldCheck
} from 'lucide-react';

interface HomePageProps {
  onOpenDonate: (campaignName?: string) => void;
  onNavigateTab: (tab: string) => void;
  onVerifyReceipt: (receiptNumber: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenDonate,
  onNavigateTab
}) => {
  const [stats] = useState({
    totalCollected: '₹ 8,45,000 +',
    totalUtilized: '₹ 5,20,000 +',
    activeCampaigns: '32 +',
    happyDonors: '1,250 +',
    eventsOrganized: '48 +'
  });

  const activeCampaigns = [
    {
      id: 'c1',
      title: 'Sri Krishna Janmashtami & Utlotsavam Mahotsavam',
      description: 'Grand Utlotsavam (Dahi Handi), devotional bhajans, cultural drama, and Annadanam for 2500+ devotees.',
      image: '/images/gallery/radha_krishna_janmashtami_banner.jpg',
      collected: 195000,
      target: 250000,
      percentage: 78
    },
    {
      id: 'c2',
      title: 'Guraja Youth Community Seva & Village Upliftment',
      description: 'Youth solidarity drives, RO clean drinking water support, and village development in Guraja.',
      image: '/images/gallery/guraja_youth_volunteers_group.png',
      collected: 210000,
      target: 300000,
      percentage: 70
    },
    {
      id: 'c3',
      title: 'Sri Krishna Swamy Temple Arch & Mandir Alankaram',
      description: 'Golden Prabhavali arch, sanctum deepam lighting, and heritage mandir maintenance.',
      image: '/images/gallery/krishna_swamy_golden_arch.jpg',
      collected: 125000,
      target: 200000,
      percentage: 62.5
    },
    {
      id: 'c4',
      title: 'Devi Navaratri Mahotsavam & Cultural Celebrations',
      description: 'Annual village Dussehra & Navaratri celebrations, kumkumarchana, and prasadam distribution.',
      image: '/images/gallery/devi_navaratri_guraja_banner.jpg',
      collected: 90000,
      target: 200000,
      percentage: 45
    }
  ];

  const recentWorks = [
    {
      id: 'w1',
      title: 'Youth Chariot Tractor Ratham Procession',
      date: 'Janmashtami 2024',
      image: '/images/gallery/youth_tractor_ratham_procession.png'
    },
    {
      id: 'w2',
      title: 'Guraja Women Vasantotsavam & Holi Festival',
      date: 'March 2024',
      image: '/images/gallery/guraja_women_holi_vasantotsavam.jpg'
    },
    {
      id: 'w3',
      title: 'Guraja Youth Procession & Heritage Rally',
      date: 'April 2024',
      image: '/images/gallery/guraja_youth_procession_rally.png'
    },
    {
      id: 'w4',
      title: 'Guraja Night Utsavam & Sound Lighting Rally',
      date: 'May 2024',
      image: '/images/gallery/guraja_night_utsav_sound_rally.png'
    }
  ];

  return (
    <div className="w-full bg-[#050E1C]">
      {/* ========================================================
          1. HERO SECTION (Exact Reference Extraction)
          ======================================================== */}
      <section className="relative pt-8 pb-24 px-4 lg:px-8 text-center overflow-hidden min-h-[92vh] flex flex-col justify-between items-center bg-[#050E1C]">
        {/* Cinematic Temple Gopuram Backdrop with Golden Aura Glow */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-40 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `url('/images/hero_temple_backdrop.jpg')`
          }}
        />

        {/* Subtle Dark Vignette & Gradient Fog */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050E1C]/80 via-transparent to-[#050E1C] pointer-events-none" />

        {/* Radiant Central Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-6 relative z-10 my-auto pt-6">
          {/* Centered Grand SKY Monogram Logo */}
          <div className="flex justify-center transform hover:scale-105 transition-transform duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl transform scale-125" />
              <SkyLogo variant="icon" size="xl" className="relative z-10 drop-shadow-[0_10px_35px_rgba(212,162,68,0.5)]" />
            </div>
          </div>

          {/* Grand Organization Title */}
          <div className="space-y-1.5 pt-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3C4] via-[#F5BD55] to-[#B38020] drop-shadow-[0_4px_25px_rgba(212,162,68,0.35)]">
              SRI KRISHNA YADAV
            </h1>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-sans uppercase tracking-[0.45em] sm:tracking-[0.6em] text-[#FCD34D] drop-shadow-md">
              YOUTH GURAJA
            </h2>
          </div>

          {/* Lotus Divider & Tagline */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-400/60" />
            <div className="flex items-center gap-2 text-amber-300/90 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase font-serif">
              <span>Unity</span>
              <span className="text-amber-500">•</span>
              <span>Youth</span>
              <span className="text-amber-500">•</span>
              <span>Service</span>
              <span className="text-amber-500">•</span>
              <span>Community</span>
              <span className="text-amber-500">•</span>
              <span>Progress</span>
            </div>
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          {/* Slogan */}
          <p className="text-sm sm:text-base text-amber-100/80 font-medium max-w-xl mx-auto italic tracking-wide">
            "Together we serve, together we grow."
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenDonate()}
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] hover:to-[#D4A244] text-slate-950 font-black text-xs sm:text-sm tracking-widest uppercase rounded-xl shadow-[0_0_35px_rgba(212,162,68,0.45)] hover:shadow-[0_0_45px_rgba(212,162,68,0.65)] transition-all transform active:scale-95"
            >
              SUPPORT A CAMPAIGN
            </button>

            <button
              onClick={() => onNavigateTab('work')}
              className="px-8 py-3.5 bg-[#08152B]/80 hover:bg-[#102445] text-white font-bold text-xs sm:text-sm tracking-widest uppercase rounded-xl border border-amber-500/40 hover:border-amber-400 transition-all shadow-lg backdrop-blur-sm"
            >
              EXPLORE OUR WORK
            </button>
          </div>
        </div>

        {/* 5 Stats Counter Row (Exact Glassmorphic Cards) */}
        <div className="w-full max-w-6xl mx-auto mt-12 px-4 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
            {/* Card 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#081730]/90 border border-amber-500/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2 backdrop-blur-md group hover:border-amber-500/60 transition-all">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.totalCollected}
              </div>
              <div className="text-[11px] font-semibold text-slate-300">
                Total Funds Collected
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#081730]/90 border border-amber-500/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2 backdrop-blur-md group hover:border-amber-500/60 transition-all">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.totalUtilized}
              </div>
              <div className="text-[11px] font-semibold text-slate-300">
                Total Funds Utilized
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#081730]/90 border border-amber-500/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2 backdrop-blur-md group hover:border-amber-500/60 transition-all">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.activeCampaigns}
              </div>
              <div className="text-[11px] font-semibold text-slate-300">
                Active Campaigns
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#081730]/90 border border-amber-500/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2 backdrop-blur-md group hover:border-amber-500/60 transition-all">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.happyDonors}
              </div>
              <div className="text-[11px] font-semibold text-slate-300">
                Happy Donors
              </div>
            </div>

            {/* Card 5 */}
            <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-[#081730]/90 border border-amber-500/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2 backdrop-blur-md group hover:border-amber-500/60 transition-all">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.eventsOrganized}
              </div>
              <div className="text-[11px] font-semibold text-slate-300">
                Events Organized
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. ACTIVE CAMPAIGNS SECTION (Crisp Light Background)
          ======================================================== */}
      <section className="bg-[#F8FAFC] text-slate-900 py-16 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 uppercase">
              ACTIVE CAMPAIGNS
            </h2>
            <button
              onClick={() => onNavigateTab('campaigns')}
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 flex items-center gap-1 transition-colors"
            >
              <span>View All Campaigns</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCampaigns.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-slate-800">
                        ₹{c.collected.toLocaleString('en-IN')} / <span className="text-slate-400">₹{c.target.toLocaleString('en-IN')}</span>
                      </span>
                      <span className="font-bold text-slate-600">{c.percentage}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4A244] rounded-full transition-all duration-700"
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenDonate(c.title)}
                    className="w-full py-2.5 bg-[#D4A244] hover:bg-[#C49132] text-slate-950 font-black text-xs tracking-wider uppercase rounded-xl shadow-md transition-all text-center"
                  >
                    SUPPORT NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. OUR RECENT WORK SECTION (Crisp Light Background)
          ======================================================== */}
      <section className="bg-[#F8FAFC] text-slate-900 pb-16 px-4 lg:px-8 border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8 pt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 uppercase">
              OUR RECENT WORK
            </h2>
            <button
              onClick={() => onNavigateTab('work')}
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 flex items-center gap-1 transition-colors"
            >
              <span>View All Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentWorks.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={w.image}
                    alt={w.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {w.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 font-mono">
                    {w.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. LORD KRISHNA SILHOUETTE TRANSITION BANNER
          ======================================================== */}
      <section className="relative py-20 px-4 text-center overflow-hidden bg-gradient-to-b from-[#061224] via-[#08152B] to-[#040C18] border-t border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/15 text-amber-300 text-xs font-mono font-bold rounded-full border border-amber-500/40 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNITY PRIDE • GURAJA VILLAGE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
            "Serving Humanity is True Devotion to Krishna"
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Every contribution made towards Sri Krishna Janmashtami, community aid, and youth empowerment is recorded with 100% mathematical integrity in our public books.
          </p>

          <div className="pt-3">
            <button
              onClick={() => onOpenDonate()}
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(212,162,68,0.4)]"
            >
              MAKE A DIFFERENCE TODAY
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
