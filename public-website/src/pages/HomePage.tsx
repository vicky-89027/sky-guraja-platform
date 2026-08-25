import React, { useState, useEffect } from 'react';
import { SkyLogo } from '../components/SkyLogo';
import {
  Globe,
  ShieldCheck,
  Heart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  BookOpenCheck,
  Users,
  QrCode,
  MapPin,
  Clock
} from 'lucide-react';

interface HomePageProps {
  onOpenDonate: (campaignName?: string) => void;
  onNavigateTab: (tab: string) => void;
  onVerifyReceipt: (receiptNumber: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenDonate,
  onNavigateTab,
  onVerifyReceipt
}) => {
  const [financials, setFinancials] = useState<any>({
    totalCollection: 130000,
    totalExpense: 60500,
    currentBalance: 69500,
    completedProjectsCount: 15
  });
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [receiptSearch, setReceiptSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/public/transparency')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setFinancials(res.data.financials || {});
          setCampaigns(res.data.campaigns || []);
        }
      })
      .catch(() => {
        // Fallback default
      });
  }, []);

  const handleReceiptSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (receiptSearch.trim()) {
      onVerifyReceipt(receiptSearch.trim());
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-16 px-4 lg:px-8 text-center overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1B36] border border-amber-500/40 text-amber-300 text-xs font-mono tracking-wider shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OFFICIAL YOUTH COMMUNITY PORTAL • GURAJA</span>
          </div>

          {/* Grand Logo */}
          <div className="py-2">
            <SkyLogo variant="full" size="xl" />
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            "United for Community. Inspired by Krishna. Working for a Better Tomorrow."
            <span className="block text-xs text-amber-200/70 font-mono mt-1">
              Yadav Youth Bhavan, Main Road, Guraja, Krishna District, Andhra Pradesh - 521321
            </span>
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <button
              onClick={() => onOpenDonate()}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>SUPPORT A CAMPAIGN</span>
            </button>

            <button
              onClick={() => onNavigateTab('work')}
              className="px-6 py-3.5 bg-[#0B1B36] hover:bg-[#102447] text-white font-bold text-sm rounded-xl border border-white/15 transition-all flex items-center gap-2 shadow-lg"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>EXPLORE OUR WORK</span>
            </button>

            <button
              onClick={() => onNavigateTab('join')}
              className="px-6 py-3.5 bg-[#061224] hover:bg-[#0E2242] text-amber-300 font-bold text-sm rounded-xl border border-amber-500/30 transition-all flex items-center gap-2 shadow-lg"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>JOIN THE COMMUNITY</span>
            </button>
          </div>
        </div>

        {/* 5 Core Pillars Section matching Brand Concept */}
        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center">
          {[
            { title: 'UNITY', sub: 'Youth Solidarity', icon: '👥', desc: 'Strengthening Yadav youth and village harmony' },
            { title: 'CULTURE', sub: 'Krishna Heritage', icon: '🪈', desc: 'Janmashtami festivals & folk arts preservation' },
            { title: 'SEVA', sub: 'Selfless Service', icon: '🤲', desc: 'Clean RO drinking water, annadanam & medical aid' },
            { title: 'YOUTH POWER', sub: 'Study & Sports', icon: '✊', desc: 'Digital library, competitive exam hall & sports' },
            { title: 'PROGRESS', sub: 'Village Upliftment', icon: '📈', desc: '100% transparent development initiatives' }
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="p-4 rounded-2xl bg-[#0B1B36]/80 border border-amber-500/20 hover:border-amber-500/50 hover:bg-[#0E2242] transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="text-2xl mb-1.5 transform group-hover:scale-110 transition-transform">{pillar.icon}</div>
                <div className="font-black text-amber-300 text-xs tracking-wider uppercase font-display">
                  {pillar.title}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase mt-0.5">{pillar.sub}</div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-tight">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. LIVE IMPACT & FINANCIAL TRANSPARENCY COUNTERS */}
      <section className="py-10 px-4 lg:px-8 bg-[#040C1A] border-y border-amber-500/20">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-mono font-bold uppercase">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Double-Entry Financial Transparency</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black font-display tracking-wide uppercase text-white mt-1">
                Every Rupee is Traceable
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('transparency')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Ledger Breakdown</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-[#0B1B36] border border-emerald-500/30 rounded-2xl text-center space-y-1 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Verified Collections</span>
              <div className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono">
                ₹{Number(financials.totalCollection || 130000).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-300 font-mono block">100% Accounted</span>
            </div>

            <div className="p-6 bg-[#0B1B36] border border-rose-500/30 rounded-2xl text-center space-y-1 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Community Spend</span>
              <div className="text-2xl lg:text-3xl font-black text-rose-400 font-mono">
                ₹{Number(financials.totalExpense || 60500).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-rose-300 font-mono block">Verified with Bills</span>
            </div>

            <div className="p-6 bg-gradient-to-b from-amber-500/15 to-[#0B1B36] border-2 border-amber-400 rounded-2xl text-center space-y-1 shadow-2xl">
              <span className="text-[11px] text-amber-300 uppercase font-bold tracking-wider">Available Reserve</span>
              <div className="text-2xl lg:text-3xl font-black text-amber-300 font-mono">
                ₹{Number(financials.currentBalance || 69500).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-amber-200 font-mono block">Exact Ledger Balance</span>
            </div>

            <div className="p-6 bg-[#0B1B36] border border-purple-500/30 rounded-2xl text-center space-y-1 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Completed Projects</span>
              <div className="text-2xl lg:text-3xl font-black text-purple-300 font-mono">
                {financials.completedProjectsCount || 15}+
              </div>
              <span className="text-[10px] text-purple-200 font-mono block">Village Initiatives</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ACTIVE CAMPAIGNS */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Featured Community Campaigns
            </h2>
            <p className="text-xs text-slate-400">Directly contribute to Guraja village empowerment and cultural programs</p>
          </div>
          <button
            onClick={() => onNavigateTab('campaigns')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>All Campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-[#0B1B36] border border-white/10 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                  FESTIVAL & CULTURE
                </span>
                <span className="font-mono text-emerald-400 font-bold text-xs">20% Achieved</span>
              </div>
              <h3 className="font-bold text-white text-lg leading-snug">
                Sri Krishna Janmashtami 2026 Grand Celebration
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Guraja's hallmark cultural festival featuring massive Annadanam Seva, traditional Utlotsavam (Dahi Handi), devotional bhajans, and felicitation of youth merit achievers.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" style={{ width: '20%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Raised: <b className="text-white font-mono">₹50,000</b></span>
                <span>Goal: <b className="text-amber-300 font-mono">₹2,50,000</b></span>
              </div>

              <button
                onClick={() => onOpenDonate('Sri Krishna Janmashtami 2026 Grand Celebration')}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>Support Janmashtami Celebration</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-[#0B1B36] border border-white/10 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                  EDUCATION & YOUTH
                </span>
                <span className="font-mono text-emerald-400 font-bold text-xs">20% Achieved</span>
              </div>
              <h3 className="font-bold text-white text-lg leading-snug">
                Youth Community Study Hall & Digital Library
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Establishing a dedicated air-conditioned study hall equipped with high-speed internet, competitive exam preparation books, computers, and mentoring for village aspirants.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" style={{ width: '20%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Raised: <b className="text-white font-mono">₹30,000</b></span>
                <span>Goal: <b className="text-amber-300 font-mono">₹1,50,000</b></span>
              </div>

              <button
                onClick={() => onOpenDonate('Youth Community Study Hall & Digital Library')}
                className="w-full py-3 bg-[#16335F] hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                <span>Support Study Hall Initiative</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISUAL PHOTO GALLERY PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Sacred Darshanam & Festivities
            </h2>
            <p className="text-xs text-slate-400">Authentic moments from Sri Krishna Mandiram & Youth Bhavan, Guraja</p>
          </div>
          <button
            onClick={() => onNavigateTab('gallery')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigateTab('gallery')}
            className="group cursor-pointer rounded-3xl overflow-hidden bg-[#0B1B36] border border-white/10 hover:border-amber-500/50 shadow-xl transition-all"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src="/images/gallery/krishna_swamy_golden_arch.jpg"
                alt="Sri Krishna Swamy Alankaram"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B36] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[9px] font-mono text-amber-300 font-bold uppercase block">Janmashtami Special</span>
                <h4 className="font-bold text-white text-xs leading-tight">Golden Arch (Prabhavali) Alankaram</h4>
              </div>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('gallery')}
            className="group cursor-pointer rounded-3xl overflow-hidden bg-[#0B1B36] border border-white/10 hover:border-amber-500/50 shadow-xl transition-all"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src="/images/gallery/marble_krishna_alankaram.jpg"
                alt="Marble Krishna Idol"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B36] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[9px] font-mono text-amber-300 font-bold uppercase block">Youth Bhavan Altar</span>
                <h4 className="font-bold text-white text-xs leading-tight">Marble Krishna with Rose Malas</h4>
              </div>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('gallery')}
            className="group cursor-pointer rounded-3xl overflow-hidden bg-[#0B1B36] border border-white/10 hover:border-amber-500/50 shadow-xl transition-all"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src="/images/gallery/temple_sanctum_darshanam.png"
                alt="Temple Sanctum Altar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B36] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[9px] font-mono text-amber-300 font-bold uppercase block">Guraja Mandiram</span>
                <h4 className="font-bold text-white text-xs leading-tight">Sanctum with Golden Kavachams</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIGITAL RECEIPT QUICK VERIFICATION SCANNER */}
      <section className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="bg-[#0B1B36] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Instant Digital Receipt Verification
              </h3>
              <p className="text-xs text-slate-300">
                Verify any contribution receipt issued by Sri Krishna Yadav Youth Guraja in the immutable ledger:
              </p>
            </div>
          </div>

          <form onSubmit={handleReceiptSearch} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              placeholder="Enter Receipt Number (e.g. SKY-REC-2026-001)"
              value={receiptSearch}
              onChange={(e) => setReceiptSearch(e.target.value)}
              className="flex-1 bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Verify Receipt
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
