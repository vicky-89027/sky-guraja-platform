import React, { useState } from 'react';
import { SkyLogo } from '../components/SkyLogo';
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Users,
  Coins,
  TrendingUp
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
    <div className="w-full">
      {/* ========================================================
          1. HERO SECTION (Dark Temple Silhouette & Royal Gold)
          ======================================================== */}
      <section className="relative pt-12 pb-20 px-4 lg:px-8 text-center overflow-hidden bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18]">
        {/* Background Aura */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 35%, rgba(245, 158, 11, 0.25) 0%, transparent 65%)`
          }}
        />

        <div className="max-w-5xl mx-auto space-y-6 relative z-10">
          {/* Grand Logo */}
          <div className="flex justify-center pt-2">
            <SkyLogo variant="full" size="xl" />
          </div>

          {/* Slogan */}
          <p className="text-sm sm:text-base text-amber-200/90 font-medium max-w-xl mx-auto italic tracking-wide">
            "Together we serve, together we grow."
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenDonate()}
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] hover:to-[#D4A244] text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-[0_0_30px_rgba(212,162,68,0.4)] transition-all transform active:scale-95"
            >
              SUPPORT A CAMPAIGN
            </button>

            <button
              onClick={() => onNavigateTab('work')}
              className="px-8 py-3.5 bg-[#0A1B35]/80 hover:bg-[#122A52] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl border border-white/20 transition-all shadow-lg"
            >
              EXPLORE OUR WORK
            </button>
          </div>
        </div>

        {/* 5 Stats Counter Row */}
        <div className="max-w-6xl mx-auto mt-16 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091830]/90 border border-amber-500/20 shadow-xl space-y-1.5 backdrop-blur-sm group hover:border-amber-500/50 transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.totalCollected}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
                Total Funds Collected
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#091830]/90 border border-amber-500/20 shadow-xl space-y-1.5 backdrop-blur-sm group hover:border-amber-500/50 transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.totalUtilized}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
                Total Funds Utilized
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#091830]/90 border border-amber-500/20 shadow-xl space-y-1.5 backdrop-blur-sm group hover:border-amber-500/50 transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.activeCampaigns}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
                Active Campaigns
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#091830]/90 border border-amber-500/20 shadow-xl space-y-1.5 backdrop-blur-sm group hover:border-amber-500/50 transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.happyDonors}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
                Happy Donors
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-[#091830]/90 border border-amber-500/20 shadow-xl space-y-1.5 backdrop-blur-sm group hover:border-amber-500/50 transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {stats.eventsOrganized}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
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
