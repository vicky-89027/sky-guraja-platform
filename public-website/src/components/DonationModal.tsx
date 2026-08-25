import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  Lock,
  ArrowRight,
  IndianRupee,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser } from './AuthModal';
import { initiateAndVerifyUPIContribution, RealReceipt } from '../services/receiptService';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCampaign?: string;
  onReceiptGenerated: (receipt: RealReceipt) => void;
  user: AuthUser | null;
  onRequireAuth: (intent?: string) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  defaultCampaign = 'Sri Krishna Janmashtami & Utlotsavam Mahotsavam',
  onReceiptGenerated,
  user
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [campaign, setCampaign] = useState(defaultCampaign);
  const [amount, setAmount] = useState<string>('2000');
  const [contributorName, setContributorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Guraja Village, Andhra Pradesh, India');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedReceipt, setVerifiedReceipt] = useState<RealReceipt | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    if (user) {
      setContributorName(user.fullName || '');
      setPhone(user.phone || '');
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (defaultCampaign) {
      setCampaign(defaultCampaign);
    }
  }, [defaultCampaign]);

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributorName.trim() || !phone.trim() || !amount || Number(amount) <= 0) {
      alert('Please fill in your name, mobile number, and a valid contribution amount.');
      return;
    }
    setStep(2);
  };

  const handleVerifyAndCompleteUPI = async () => {
    try {
      setIsProcessing(true);
      const receipt = await initiateAndVerifyUPIContribution({
        contributorName: contributorName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        campaignId: campaign.toLowerCase().replace(/\s+/g, '-'),
        campaignTitle: campaign,
        amount: Number(amount)
      });

      setVerifiedReceipt(receipt);
      setStep(3);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onReceiptGenerated(receipt);
    } catch (err: any) {
      alert(err.message || 'Payment verification failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText('skyouthguraja@sbi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
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

        {/* =========================================================================
            STEP 1: CONTRIBUTOR DETAILS & AMOUNT
            ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4A244] to-[#B38020] text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Coins className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h3 className="text-base font-black text-white font-serif uppercase tracking-wide">
                  Make a Contribution (UPI)
                </h3>
                <p className="text-[10px] text-amber-300 font-mono">
                  Official Sri Krishna Yadav Youth Guraja Seva Fund
                </p>
              </div>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-3 text-xs">
              {/* Campaign Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Purpose / Campaign *
                </label>
                <select
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
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

              {/* Amount Presets */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Contribution Amount (₹) *
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['500', '1000', '2000', '5000'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        amount === val
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                          : 'bg-[#050F21] text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-amber-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter custom amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#050F21] border border-amber-500/40 focus:border-amber-400 rounded-xl pl-8 pr-3.5 py-2.5 text-amber-300 font-black text-base outline-none font-mono"
                  />
                </div>
              </div>

              {/* Contributor Information */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name (As per Bank / ID) *
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
                    Email (For E-Receipt)
                  </label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Address / Village
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guraja Village, Krishna District"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>PROCEED TO UPI PAYMENT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            STEP 2: UPI PAYMENT GATEWAY & SCAN QR
            ========================================================================= */}
        {step === 2 && (
          <div className="space-y-4 text-center">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] text-amber-400 font-mono tracking-wider uppercase block">
                Official UPI Gateway
              </span>
              <h3 className="text-base font-black text-white font-serif uppercase">
                Scan & Pay ₹{Number(amount).toLocaleString('en-IN')}
              </h3>
            </div>

            {/* UPI QR Display */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl border-4 border-amber-400/40">
              <div className="w-44 h-44 bg-slate-100 rounded-xl flex flex-col items-center justify-center p-2 border border-slate-300 text-slate-900 space-y-1">
                <QrCode className="w-24 h-24 text-slate-900" />
                <span className="text-[9px] font-bold text-slate-600 font-mono">
                  UPI ID: skyouthguraja@sbi
                </span>
                <span className="text-[10px] font-black text-slate-900">
                  ₹{Number(amount).toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>

            {/* UPI ID Copy Bar */}
            <div className="flex items-center justify-between p-3 bg-[#050F21] rounded-xl border border-white/10 text-xs">
              <div className="text-left">
                <div className="text-[10px] text-slate-400">Official Committee UPI VPA</div>
                <div className="font-mono font-bold text-amber-300">skyouthguraja@sbi</div>
              </div>
              <button
                onClick={handleCopyUpiId}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold flex items-center gap-1 text-[11px]"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleVerifyAndCompleteUPI}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 fill-slate-950 text-emerald-500" />
                <span>{isProcessing ? 'VERIFYING PAYMENT WITH GATEWAY...' : 'I HAVE PAID • VERIFY & ISSUE E-RECEIPT'}</span>
              </button>

              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Edit Amount or Contributor Details
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: PAYMENT VERIFIED & SUCCESS SCREEN
            ========================================================================= */}
        {step === 3 && verifiedReceipt && (
          <div className="space-y-5 text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white font-serif uppercase tracking-wide">
                Contribution Verified!
              </h3>
              <p className="text-xs text-emerald-300 font-mono">
                Official E-Receipt Generated Successfully
              </p>
            </div>

            <div className="p-4 bg-[#050F21] rounded-2xl border border-amber-500/30 text-xs space-y-2 text-left">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-slate-400">Receipt Number</span>
                <span className="font-mono font-black text-amber-300 text-sm">
                  {verifiedReceipt.receiptNumber}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-slate-400">Contributor</span>
                <span className="font-bold text-white">
                  {verifiedReceipt.contribution.contributorName}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-slate-400">Amount</span>
                <span className="font-mono font-bold text-white">
                  ₹ {verifiedReceipt.contribution.amount.toLocaleString('en-IN')}.00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method</span>
                <span className="font-mono font-semibold text-emerald-300">
                  {verifiedReceipt.contribution.paymentMethod} (VERIFIED)
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onReceiptGenerated(verifiedReceipt);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>VIEW OFFICIAL E-RECEIPT (PDF / PRINT)</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close and Return to Website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
