import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { SkyLogo } from '../components/SkyLogo';
import { Globe, ShieldCheck, Coins, ArrowDownRight, Wallet, CheckCircle2, Search, Heart, Sparkles, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublicTransparencyViewProps {
  onOpenReceipt: (receiptNo: string) => void;
}

export const PublicTransparencyView: React.FC<PublicTransparencyViewProps> = ({ onOpenReceipt }) => {
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
    loadPublicData();
  }, []);

  const loadPublicData = () => {
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
      alert('Please fill your name and amount');
      return;
    }

    setDonating(true);
    const mockPaymentId = `PAY_GATEWAY_${Date.now().toString().slice(-6)}`;

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
        confetti({ particleCount: 100, spread: 80 });
        alert(`Thank you ${donorName}! Your donation of ₹${amount} was received into the ledger. Receipt: ${result.receiptNumber}`);
        setIsDonateOpen(false);
        setDonorName('');
        setPhone('');
        loadPublicData();
        if (result.receiptNumber) {
          onOpenReceipt(result.receiptNumber);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Donation simulation failed');
    } finally {
      setDonating(false);
    }
  };

  const financials = data?.financials || {};
  const campaigns = data?.campaigns || [];
  const recentDonors = data?.recentPublicDonors || [];
  const org = data?.organization || {};

  return (
    <div className="min-h-screen bg-[#061224] text-white p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Grand Hero Transparency Banner with Official Logo */}
      <div className="text-center space-y-5 py-8 px-6 bg-gradient-to-b from-[#0B1B36] via-[#0E2447] to-[#061224] border border-amber-500/35 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/15 text-amber-300 text-xs font-bold rounded-full border border-amber-500/40 uppercase tracking-widest">
          <Globe className="w-3.5 h-3.5" />
          <span>Public Transparency Portal • Every Rupee Traceable</span>
        </div>

        {/* Full Brand Logo */}
        <div className="py-2">
          <SkyLogo variant="full" size="xl" />
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          "United for Community. Inspired by Krishna. Working for a Better Tomorrow."
          <span className="block text-[11px] text-amber-200/70 font-mono mt-1">
            Yadav Youth Bhavan, Main Road, Guraja, Krishna District, Andhra Pradesh
          </span>
        </p>

        {/* 5 Core Pillars Bar matching Brand Graphic */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-4xl mx-auto pt-2">
          {[
            { title: 'UNITY', sub: 'Youth Solidarity', icon: '👥' },
            { title: 'CULTURE', sub: 'Krishna Heritage', icon: '🪈' },
            { title: 'SEVA', sub: 'Selfless Service', icon: '🤲' },
            { title: 'YOUTH POWER', sub: 'Study & Sports', icon: '✊' },
            { title: 'PROGRESS', sub: 'Village Upliftment', icon: '📈' }
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="p-2.5 rounded-xl bg-[#061224]/80 border border-amber-500/20 hover:border-amber-500/50 transition-all text-center group"
            >
              <div className="text-lg mb-0.5">{pillar.icon}</div>
              <div className="font-extrabold text-amber-300 text-xs tracking-wider uppercase font-display">
                {pillar.title}
              </div>
              <div className="text-[9px] text-slate-400 font-sans">{pillar.sub}</div>
            </div>
          ))}
        </div>

        <div className="pt-3">
          <button
            onClick={() => setIsDonateOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all inline-flex items-center gap-2 transform active:scale-95"
          >
            <Heart className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Donate Online to Guraja Youth Fund</span>
          </button>
        </div>
      </div>

      {/* Macro Numbers (Public Confidence) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0B1B36] border border-emerald-500/30 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Verified Collections</span>
          <div className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono">
            ₹{Number(financials.totalCollection || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-5 bg-[#0B1B36] border border-rose-500/30 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Community Spend</span>
          <div className="text-2xl lg:text-3xl font-black text-rose-400 font-mono">
            ₹{Number(financials.totalExpense || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-5 bg-[#0B1B36] border-2 border-amber-400 rounded-2xl text-center space-y-1 bg-gradient-to-b from-amber-500/10 to-[#0B1B36]">
          <span className="text-[10px] text-amber-300 uppercase font-bold">Current Reserve Balance</span>
          <div className="text-2xl lg:text-3xl font-black text-amber-300 font-mono">
            ₹{Number(financials.currentBalance || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-5 bg-[#0B1B36] border border-purple-500/30 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Completed Projects</span>
          <div className="text-2xl lg:text-3xl font-black text-purple-300 font-mono">
            {financials.completedProjectsCount || 15}+
          </div>
        </div>
      </div>

      {/* Online Digital Receipt Verifier */}
      <div className="p-6 bg-[#0B1B36] border border-amber-500/30 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white font-display">
            Verify Authentic Digital Receipt
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          Enter your Receipt Number (e.g. <span className="font-mono text-amber-300">SKY-REC-2026-001</span>) to verify its authentic cryptographic ledger record:
        </p>

        <form onSubmit={handleVerifyReceipt} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter receipt number (SKY-REC-2026-001)"
            value={verifyReceiptInput}
            onChange={(e) => setVerifyReceiptInput(e.target.value)}
            className="flex-1 bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
            required
          />
          <button
            type="submit"
            disabled={verifying}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
          >
            {verifying ? 'Verifying...' : 'Verify Receipt'}
          </button>
        </form>

        {/* Verification Result Card */}
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
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20 text-slate-300">
                <div>Donor: <b className="text-white">{verifyResult.data.donor_name}</b></div>
                <div>Amount: <b className="text-emerald-300 font-mono">₹{Number(verifyResult.data.amount).toLocaleString('en-IN')}</b></div>
                <div>Campaign: <b className="text-white">{verifyResult.data.campaign_name}</b></div>
                <div>Date: <b className="text-white font-mono">{verifyResult.data.date}</b></div>
                <div className="col-span-2 text-[10px] font-mono text-emerald-300">
                  Security Hash: {verifyResult.data.security_hash}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Public Active Campaigns */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-display">Active Community Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c: any) => {
            const pct = Math.min(Math.round((c.collected_amount / c.target_amount) * 100), 100);
            return (
              <div key={c.id} className="p-5 bg-[#0B1B36] border border-white/10 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">{c.name}</h4>
                  <span className="font-mono text-emerald-400 font-bold text-xs">{pct}%</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{c.description}</p>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Raised: <b className="text-white font-mono">₹{Number(c.collected_amount).toLocaleString('en-IN')}</b></span>
                  <span>Target: <b className="text-amber-300 font-mono">₹{Number(c.target_amount).toLocaleString('en-IN')}</b></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Public Donors Wall */}
      <div className="p-6 bg-[#0B1B36] border border-white/10 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white font-display">
          Recent Community Donors Wall (Privacy Protected)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentDonors.map((d: any, idx: number) => (
            <div key={idx} className="p-3 bg-[#061224] rounded-xl border border-white/5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{d.donor_name}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{d.campaign_name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-emerald-400">₹{Number(d.amount).toLocaleString('en-IN')}</div>
                <div className="text-[9px] text-slate-500 font-mono">{d.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Online Donation Simulation Modal */}
      {isDonateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="e.g. 98480 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">Amount to Donate (₹) *</label>
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
