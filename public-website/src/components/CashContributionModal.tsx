import React, { useState } from 'react';
import {
  X,
  Banknote,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AuthUser } from './AuthModal';
import { createMemberCashContribution, RealReceipt } from '../services/receiptService';
import confetti from 'canvas-confetti';

interface CashContributionModalProps {
  user: AuthUser | null;
  onClose: () => void;
  onSuccess: (receipt: RealReceipt) => void;
}

export const CashContributionModal: React.FC<CashContributionModalProps> = ({
  user,
  onClose,
  onSuccess
}) => {
  const [contributorName, setContributorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Guraja Village, Andhra Pradesh, India');
  const [campaignTitle, setCampaignTitle] = useState('Sri Krishna Janmashtami & Utlotsavam Mahotsavam');
  const [amount, setAmount] = useState('');
  const [cashDate, setCashDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Strict member/admin permission check
  const isAuthorized = user && ['MEMBER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role);

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
        <div className="bg-[#08152B] border border-rose-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white uppercase">Access Restricted</h3>
          <p className="text-xs text-slate-300">
            Cash contributions can only be recorded by authenticated Committee Members or Administrators.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = Number(amount);
    if (!contributorName.trim() || !phone.trim() || !parsedAmount || parsedAmount <= 0) {
      setError('Please fill in contributor name, phone number, and a valid amount.');
      return;
    }

    try {
      setLoading(true);
      const receipt = await createMemberCashContribution({
        memberId: user.phone || 'mem-01',
        memberName: user.fullName,
        memberRole: user.role,
        contributorName: contributorName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        campaignId: campaignTitle.toLowerCase().replace(/\s+/g, '-'),
        campaignTitle,
        amount: parsedAmount,
        cashReceivedDate: new Date(cashDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        notes: notes.trim() || undefined
      });

      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      onSuccess(receipt);
    } catch (err: any) {
      setError(err.message || 'Failed to record cash contribution.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#08152B] border border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white font-serif uppercase tracking-wide">
              Record Cash Contribution
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-amber-300 font-mono">
              <span>Recorded By: {user.fullName}</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Contributor Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. K. Venkata Ramana Yadav"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="98480 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="contributor@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Address / Village *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Guraja Village, Krishna District"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Purpose / Campaign *
            </label>
            <select
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
            >
              <option value="Sri Krishna Janmashtami & Utlotsavam Mahotsavam">
                Sri Krishna Janmashtami & Utlotsavam Mahotsavam
              </option>
              <option value="Guraja Youth Community Seva & Village Upliftment">
                Guraja Youth Community Seva & Village Upliftment
              </option>
              <option value="Sri Krishna Swamy Temple Arch & Mandir Alankaram">
                Sri Krishna Swamy Temple Arch & Mandir Alankaram
              </option>
              <option value="Devi Navaratri Mahotsavam & Cultural Celebrations">
                Devi Navaratri Mahotsavam & Cultural Celebrations
              </option>
              <option value="General Youth Seva Fund">
                General Youth Seva Fund
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Cash Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#050F21] border border-amber-500/40 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-amber-300 font-black text-base outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Cash Received Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={cashDate}
                  onChange={(e) => setCashDate(e.target.value)}
                  className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Internal Committee Notes / Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Received at Yadav Bhavan / Receipt Book Entry #12"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Banknote className="w-4 h-4" />
              <span>{loading ? 'RECORDING & ISSUING RECEIPT...' : 'CONFIRM CASH RECEIVED & ISSUE E-RECEIPT'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashContributionModal;
