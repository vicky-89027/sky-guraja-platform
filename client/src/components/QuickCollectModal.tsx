import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Campaign, AuthUser } from '../types';
import { X, Coins, Sparkles, CheckCircle2, User, Phone, IndianRupee, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickCollectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receiptNumber?: string) => void;
  user: AuthUser | null;
}

export const QuickCollectModal: React.FC<QuickCollectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER'>('UPI');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');
  const [autoVerify, setAutoVerify] = useState(user?.role === 'SUPER_ADMIN' || user?.role === 'TREASURER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.getCampaigns()
        .then((res) => {
          if (res.success && res.data.length > 0) {
            setCampaigns(res.data);
            setCampaignId(res.data[0].id);
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !phone || !amount || !campaignId) {
      setError('Please fill all required fields (Donor name, Phone, Amount, Campaign)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createContribution({
        donorName,
        phone,
        email: email || undefined,
        amount: Number(amount),
        campaignId,
        purpose: purpose || 'General Community Contribution',
        paymentMethod,
        referenceNo: referenceNo || undefined,
        notes: notes || undefined,
        autoVerify
      });

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Reset form
        setDonorName('');
        setPhone('');
        setEmail('');
        setAmount('');
        setReferenceNo('');
        setNotes('');
        onSuccess(res.data?.receiptNumber);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to record contribution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0B1B36] border border-amber-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0E2447] to-[#142F5B] border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                Field Donation Collection
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  Fast Flow
                </span>
              </h2>
              <p className="text-xs text-slate-300">Sri Krishna Yadav Youth Guraja • Instant Receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Campaign Selection */}
          <div>
            <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1.5">
              Select Campaign *
            </label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all"
              required
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Goal: ₹{c.target_amount.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Donor Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Donor Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. M. Venkateswara Rao"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="e.g. 98480 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amount and Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1.5">
              Contribution Amount (₹) *
            </label>
            <div className="relative mb-2">
              <IndianRupee className="absolute left-3.5 top-2.5 w-4 h-4 text-amber-400" />
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#061224] border border-amber-500/30 focus:border-amber-400 text-amber-300 font-bold text-base rounded-xl pl-9 pr-3.5 py-2 outline-none font-mono"
                min="1"
                required
              />
            </div>
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5">
              {quickAmounts.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setAmount(q.toString())}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium transition-all ${
                    amount === q.toString()
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-[#0E2447] text-slate-300 hover:bg-[#16335F] border border-white/5'
                  }`}
                >
                  ₹{q.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Method *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'UPI', label: 'UPI / QR' },
                { id: 'CASH', label: 'Cash' },
                { id: 'BANK_TRANSFER', label: 'Bank Transfer' }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    paymentMethod === m.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-400 font-bold shadow-sm'
                      : 'bg-[#061224] text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reference No & Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Transaction Ref / UTR (Optional)</label>
              <input
                type="text"
                placeholder="e.g. UPI/260824/99123"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Purpose / Seva Type</label>
              <input
                type="text"
                placeholder="e.g. Annadanam / Study Hall"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Auto-verify checkbox if authorized */}
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'TREASURER') && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Verify & Post to Ledger
                </div>
                <div className="text-[10px] text-slate-300">
                  Instantly issues verified digital receipt & credits ledger.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoVerify}
                onChange={(e) => setAutoVerify(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Recording in Ledger...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Donation & Generate Receipt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
