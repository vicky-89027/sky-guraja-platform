import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { SkyLogo } from '../components/SkyLogo';
import {
  Globe,
  ShieldCheck,
  Coins,
  ArrowDownRight,
  Wallet,
  CheckCircle2,
  Search,
  Heart,
  Sparkles,
  QrCode,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  Award,
  ChevronRight,
  BookOpenCheck,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LandingPageViewProps {
  onEnterDashboard: () => void;
  onOpenReceipt: (receiptNo: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterDashboard,
  onOpenReceipt
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifyReceiptInput, setVerifyReceiptInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  // Online Donation Modal
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateCampaignId, setDonateCampaignId] = useState('');
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('1000');
  const [phone, setPhone] = useState('');
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    loadLandingData();
  }, []);

  const loadLandingData = () => {
    setLoading(true);
    api.getPublicTransparency()
      .then((res) => {
        if (res.success) {
          setData(res.data);
          if (res.data.campaigns?.length > 0) {
            setDonateCampaignId(res.data.campaigns[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleVerifyReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyReceiptInput.trim()) return;
    setVerifying(true);
    setVerifyResult(null);

    try {
      const res = await api.verifyPublicReceipt(verifyReceiptInput.trim());
      setVerifyResult(res);
    } catch (err: any) {
      setVerifyResult({ isValid: false, message: err.message || 'Verification lookup failed' });
    } finally {
      setVerifying(false);
    }
  };

  const handleSimulateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !amount) {
      alert('Please enter your name and contribution amount');
      return;
    }

    setDonating(true);
    const mockPaymentId = `PAY_SKY_${Date.now().toString().slice(-6)}`;

    try {
      const res = await fetch('http://localhost:5000/api/public/webhook/payment-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'PAYMENT_SUCCESS',
          paymentId: mockPaymentId,
          amount: Number(amount),
          donorName,
          phone,
          campaignId: donateCampaignId
        })
      });
      const result = await res.json();
      if (result.success) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        alert(`Thank you ${donorName}! Your contribution of ₹${amount} has been recorded directly into the verified ledger. Receipt: ${result.receiptNumber}`);
        setIsDonateOpen(false);
        setDonorName('');
        setPhone('');
        loadLandingData();
        if (result.receiptNumber) {
          onOpenReceipt(result.receiptNumber);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Donation processing failed');
    } finally {
      setDonating(false);
    }
  };

  const financials = data?.financials || {};
  const campaigns = data?.campaigns || [];
  const recentDonors = data?.recentPublicDonors || [];
  const org = data?.organization || {};

  return (
    <div className="min-h-screen bg-[#061224] text-white flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#061224]/90 backdrop-blur-lg border-b border-amber-500/20 px-4 lg:px-12 py-3.5 flex items-center justify-between shadow-2xl">
        <SkyLogo variant="horizontal" size="md" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDonateOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-slate-950" />
            <span>Donate Online</span>
          </button>

          <button
            onClick={onEnterDashboard}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0B1B36] hover:bg-[#12274A] border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition-all shadow-md group"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Committee Portal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-12 pb-20 px-4 lg:px-8 text-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1B36] border border-amber-500/40 text-amber-300 text-xs font-mono tracking-wider shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OFFICIAL YOUTH COMMUNITY PORTAL • GURAJA</span>
          </div>

          {/* Grand Logo */}
          <div className="py-3">
            <SkyLogo variant="full" size="xl" />
          </div>

          {/* Motto */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            "United for Community. Inspired by Krishna. Working for a Better Tomorrow."
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Contribute to Community Fund</span>
            </button>

            <button
              onClick={onEnterDashboard}
              className="px-6 py-3.5 bg-[#0B1B36] hover:bg-[#102447] text-white font-bold text-sm rounded-xl border border-white/15 transition-all flex items-center gap-2 shadow-lg"
            >
              <BookOpenCheck className="w-4 h-4 text-emerald-400" />
              <span>View Verified Ledger & Operations</span>
            </button>
          </div>
        </div>

        {/* 5 Core Pillars Section matching Brand Concept */}
        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center">
          {[
            { title: 'UNITY', sub: 'Youth Solidarity', icon: '👥', desc: 'Strengthening community bonds' },
            { title: 'CULTURE', sub: 'Krishna Heritage', icon: '🪈', desc: 'Janmashtami & folk festivals' },
            { title: 'SEVA', sub: 'Selfless Service', icon: '🤲', desc: 'Annadanam & drinking water' },
            { title: 'YOUTH POWER', sub: 'Study & Sports', icon: '✊', desc: 'Digital library & tournaments' },
            { title: 'PROGRESS', sub: 'Village Upliftment', icon: '📈', desc: 'Transparent development' }
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
      </header>

      {/* Live Financial Transparency Dashboard (Rule 21) */}
      <section className="py-12 px-4 lg:px-8 bg-[#040C1A] border-y border-amber-500/20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-black font-display tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
              Live Financial Transparency & Balance
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Every rupee collected and spent by the youth committee is immutably published and auditable in real time.
            </p>
          </div>

          {/* Macro KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-[#0B1B36] border border-emerald-500/30 rounded-2xl text-center space-y-1 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Verified Collections</span>
              <div className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono">
                ₹{Number(financials.totalCollection || 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-300 font-mono block">100% Accounted</span>
            </div>

            <div className="p-6 bg-[#0B1B36] border border-rose-500/30 rounded-2xl text-center space-y-1 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Community Spend</span>
              <div className="text-2xl lg:text-3xl font-black text-rose-400 font-mono">
                ₹{Number(financials.totalExpense || 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-rose-300 font-mono block">Verified with Bills</span>
            </div>

            <div className="p-6 bg-gradient-to-b from-amber-500/15 to-[#0B1B36] border-2 border-amber-400 rounded-2xl text-center space-y-1 shadow-2xl">
              <span className="text-[11px] text-amber-300 uppercase font-bold tracking-wider">Current Available Reserve</span>
              <div className="text-2xl lg:text-3xl font-black text-amber-300 font-mono">
                ₹{Number(financials.currentBalance || 0).toLocaleString('en-IN')}
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

      {/* Online Digital Receipt Verification Section */}
      <section className="py-12 px-4 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-[#0B1B36] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Verify Authentic Digital Receipt
              </h3>
              <p className="text-xs text-slate-300">
                Enter your official Receipt Number (e.g. <span className="font-mono text-amber-300 font-bold">SKY-REC-2026-001</span>) to verify its cryptographic record in the Guraja ledger.
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyReceipt} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              placeholder="Enter Receipt Number (SKY-REC-2026-001)"
              value={verifyReceiptInput}
              onChange={(e) => setVerifyReceiptInput(e.target.value)}
              className="flex-1 bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none"
              required
            />
            <button
              type="submit"
              disabled={verifying}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {verifying ? 'Verifying...' : 'Verify Cryptographic Receipt'}
            </button>
          </form>

          {/* Verification Results */}
          {verifyResult && (
            <div
              className={`p-4 rounded-xl text-xs space-y-2 border ${
                verifyResult.isValid
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-500/15 border-red-500/40 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {verifyResult.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-red-400" />
                )}
                <span>{verifyResult.message}</span>
              </div>

              {verifyResult.isValid && verifyResult.data && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20 text-slate-300">
                  <div>Donor: <b className="text-white">{verifyResult.data.donor_name}</b></div>
                  <div>Amount: <b className="text-emerald-300 font-mono">₹{Number(verifyResult.data.amount).toLocaleString('en-IN')}</b></div>
                  <div>Campaign: <b className="text-white">{verifyResult.data.campaign_name}</b></div>
                  <div>Date: <b className="text-white font-mono">{verifyResult.data.date}</b></div>
                  <div className="col-span-1 sm:col-span-2 text-[10px] font-mono text-emerald-300">
                    Security Hash: {verifyResult.data.security_hash}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Active Community Campaigns */}
      <section className="py-12 px-4 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Active Community Campaigns
            </h2>
            <p className="text-xs text-slate-400">Join hands in funding critical village initiatives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c: any) => {
            const pct = Math.min(Math.round((c.collected_amount / c.target_amount) * 100), 100);
            return (
              <div
                key={c.id}
                className="p-6 bg-[#0B1B36] border border-white/10 rounded-2xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                      {c.category.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">{pct}%</span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{c.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{c.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Collected: <b className="text-white font-mono">₹{Number(c.collected_amount).toLocaleString('en-IN')}</b></span>
                    <span>Target: <b className="text-amber-300 font-mono">₹{Number(c.target_amount).toLocaleString('en-IN')}</b></span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDonateCampaignId(c.id);
                    setIsDonateOpen(true);
                  }}
                  className="w-full py-2.5 bg-[#16335F] hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Support this Campaign</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Public Donors Wall */}
      <section className="py-12 px-4 lg:px-8 max-w-6xl mx-auto w-full space-y-4">
        <h3 className="text-lg font-bold text-white font-display">
          Recent Community Donors Wall (Privacy Protected)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {recentDonors.map((d: any, idx: number) => (
            <div key={idx} className="p-3.5 bg-[#0B1B36] rounded-xl border border-white/5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{d.donor_name}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[170px]">{d.campaign_name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-extrabold text-emerald-400">₹{Number(d.amount).toLocaleString('en-IN')}</div>
                <div className="text-[9px] text-slate-500 font-mono">{d.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#030914] border-t border-white/10 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex justify-center mb-2">
          <SkyLogo variant="compact" size="sm" />
        </div>
        <p className="text-slate-400">
          <b>SRI KRISHNA YADAV YOUTH GURAJA (SKY)</b> • Yadav Youth Bhavan, Main Road, Guraja, Krishna District, AP - 521321
        </p>
        <p className="text-[11px] text-slate-600">
          Official Youth Committee Operating Platform • Every Rupee Traceable
        </p>
      </footer>

      {/* Online Donation Modal */}
      {isDonateOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <form onSubmit={handleSimulateDonation} className="bg-[#0B1B36] border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
              Online Contribution Gateway
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Campaign *</label>
              <select
                value={donateCampaignId}
                onChange={(e) => setDonateCampaignId(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                {campaigns.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Donor Full Name *</label>
              <input
                type="text"
                placeholder="e.g. S. Jagadeesh Yadav"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone (Optional)</label>
              <input
                type="tel"
                placeholder="e.g. 98480 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">Contribution Amount (₹) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#061224] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold font-mono outline-none"
                min="1"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDonateOpen(false)}
                className="px-4 py-2 bg-[#16335F] text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={donating}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
              >
                {donating ? 'Processing...' : 'Complete Contribution'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LandingPageView;
