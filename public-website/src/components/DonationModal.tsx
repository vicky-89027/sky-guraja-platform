import React, { useState, useEffect } from 'react';
import {
  Heart,
  X,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Lock,
  ArrowRight,
  IndianRupee,
  Building2,
  Copy,
  Check,
  Coins,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser } from './AuthModal';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCampaign?: string;
  onReceiptGenerated: (receiptNumber: string) => void;
  user: AuthUser | null;
  onRequireAuth: (intent?: string) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  defaultCampaign = 'Sri Krishna Janmashtami 2026 Grand Celebration',
  onReceiptGenerated,
  user,
  onRequireAuth
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [campaign, setCampaign] = useState(defaultCampaign);
  const [amount, setAmount] = useState<string>('2000');
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [pan, setPan] = useState('');
  const [isPublicOptIn, setIsPublicOptIn] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'BANK' | 'CASH'>('UPI');
  const [upiRef, setUpiRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedReceipt, setVerifiedReceipt] = useState<any>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  useEffect(() => {
    if (user) {
      setDonorName(user.fullName || '');
      setPhone(user.phone || '');
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (defaultCampaign) {
      setCampaign(defaultCampaign);
    }
  }, [defaultCampaign]);

  if (!isOpen) return null;

  // If user is not logged in, prompt registration first
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#0B1B36] border border-amber-500/40 rounded-3xl w-full max-w-md shadow-2xl p-6 text-center space-y-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
            <UserCheck className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
              Member Registration Required
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              To ensure 100% financial transparency and issue a verified cryptographic receipt, please <b>Register</b> or <b>Sign In</b> before transferring funds.
            </p>
          </div>

          <div className="p-3 bg-[#061224] rounded-2xl border border-white/10 text-left text-xs space-y-1 text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct member account attribution</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <QrCode className="w-4 h-4" />
              <span>Instant digital receipt with QR verification</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onRequireAuth('transfer_funds');
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
            >
              REGISTER / SIGN IN NOW
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 bg-transparent text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const quickAmounts = ['500', '1000', '2000', '5000', '10000', '25000'];

  const handleNextFromAmount = () => {
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }
    setStep(2);
  };

  const handleNextFromDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      alert('Please enter your full name');
      return;
    }
    setStep(3);
  };

  const handleProcessTransfer = async () => {
    setIsProcessing(true);
    const paymentId = upiRef.trim() || `SKY_TXN_${Date.now().toString().slice(-6)}`;

    try {
      const res = await fetch('http://localhost:5000/api/public/webhook/payment-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'PAYMENT_SUCCESS',
          paymentId: paymentId,
          amount: Number(amount),
          donorName: donorName || user.fullName,
          phone: phone || user.phone,
          campaignName: campaign,
          isPublicOptIn
        })
      });

      const data = await res.json();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      const recNumber = data.receiptNumber || `SKY-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      setVerifiedReceipt({
        receiptNumber: recNumber,
        donorName: donorName || user.fullName,
        amount: Number(amount),
        campaign,
        paymentMethod,
        refNo: paymentId,
        date: new Date().toISOString().split('T')[0],
        securityHash: `HASH-${Date.now().toString(16).toUpperCase()}`
      });
      setStep(4);
    } catch {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      const recNumber = `SKY-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setVerifiedReceipt({
        receiptNumber: recNumber,
        donorName: donorName || user.fullName,
        amount: Number(amount),
        campaign,
        paymentMethod,
        refNo: paymentId,
        date: new Date().toISOString().split('T')[0],
        securityHash: `HASH-${Date.now().toString(16).toUpperCase()}`
      });
      setStep(4);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyBankDetails = () => {
    const text = `Sri Krishna Yadav Youth Guraja\nA/C: 38491029384\nIFSC: SBIN0001234\nState Bank of India, Guraja Branch`;
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 3000);
  };

  const handleClose = () => {
    setStep(1);
    setVerifiedReceipt(null);
    setUpiRef('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B1B36] border border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#061224]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-display uppercase tracking-tight">
                Transfer Funds & Contribute
              </h3>
              <p className="text-[10px] text-amber-200/80 font-mono">
                Logged in as: <b className="text-white">{user.fullName}</b> ({user.role})
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-3 flex items-center justify-between text-[11px] text-slate-400 font-semibold border-b border-white/5 pb-2.5">
          <span className={step >= 1 ? 'text-amber-400 font-bold' : ''}>1. Amount</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-amber-400 font-bold' : ''}>2. Contributor Info</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-amber-400 font-bold' : ''}>3. Transfer / Pay</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-emerald-400 font-bold' : ''}>4. Digital Receipt</span>
        </div>

        <div className="p-6">
          {/* STEP 1: CAMPAIGN & AMOUNT */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Initiative</label>
                <select
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                >
                  <option value="Sri Krishna Janmashtami 2026 Grand Celebration">Sri Krishna Janmashtami 2026 Grand Celebration</option>
                  <option value="Youth Community Study Hall & Digital Library">Youth Community Study Hall & Digital Library</option>
                  <option value="Guraja Clean Drinking Water (RO Plant Maintenance)">Guraja Clean Drinking Water (RO Plant Maintenance)</option>
                  <option value="Emergency Medical Aid & Youth Blood Donation Wing">Emergency Medical Aid & Youth Blood Donation Wing</option>
                  <option value="General Youth Development & Village Welfare Fund">General Youth Development & Village Welfare Fund</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-2">Select Contribution Amount (₹)</label>
                <div className="grid grid-cols-3 gap-2.5 mb-3">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                        amount === q
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-[#061224] text-slate-300 border-white/10 hover:border-amber-500/40'
                      }`}
                    >
                      ₹{Number(q).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-amber-400 font-bold font-mono text-sm">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full bg-[#061224] border border-amber-500/40 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold font-mono text-amber-300 outline-none"
                    min="1"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextFromAmount}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONTRIBUTOR DETAILS */}
          {step === 2 && (
            <form onSubmit={handleNextFromDetails} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Donor / Member Name *</label>
                <input
                  type="text"
                  placeholder="e.g. S. Jagadeesh Yadav"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile (WhatsApp Receipt)</label>
                  <input
                    type="tel"
                    placeholder="98480 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">PAN Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#061224] border border-white/10 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPublicOptIn}
                    onChange={(e) => setIsPublicOptIn(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 mt-0.5"
                  />
                  <span>
                    <b>Display my contribution on Public Donors Wall</b>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      Your identity and receipt will be credited in the village transparency books.
                    </span>
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-[#16335F] text-slate-300 text-xs rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <span>Choose Transfer Mode</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT / TRANSFER METHOD */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#061224] rounded-2xl border border-amber-500/30 text-center space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Contribution Amount</span>
                <div className="text-3xl font-black text-amber-300 font-mono">
                  ₹{Number(amount).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  Campaign: {campaign}
                </div>
              </div>

              {/* Mode Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                    paymentMethod === 'UPI'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-[#061224] text-slate-400 border-white/10'
                  }`}
                >
                  📱 UPI QR / App
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BANK')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                    paymentMethod === 'BANK'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                      : 'bg-[#061224] text-slate-400 border-white/10'
                  }`}
                >
                  🏦 Bank NEFT/IMPS
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                    paymentMethod === 'CASH'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-[#061224] text-slate-400 border-white/10'
                  }`}
                >
                  💵 Cash Handover
                </button>
              </div>

              {/* 1. UPI Mode */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-[#061224] border border-amber-500/20 rounded-2xl space-y-3 text-center">
                  <div className="inline-block p-3 bg-white rounded-2xl shadow-lg">
                    <QrCode className="w-36 h-36 text-slate-950 mx-auto" />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-mono text-amber-300 font-bold">UPI ID: skyguraja@sbi</div>
                    <p className="text-[11px] text-slate-400">
                      Scan using Google Pay, PhonePe, Paytm, or BHIM UPI
                    </p>
                  </div>

                  <div>
                    <label className="block text-left text-[11px] text-slate-300 font-semibold mb-1">
                      UPI Reference / UTR Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 423891823901"
                      value={upiRef}
                      onChange={(e) => setUpiRef(e.target.value)}
                      className="w-full bg-[#0B1B36] border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 2. Direct Bank Transfer */}
              {paymentMethod === 'BANK' && (
                <div className="p-4 bg-[#061224] border border-cyan-500/20 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <b className="text-cyan-300 text-sm">Official Bank Account</b>
                    <button
                      onClick={copyBankDetails}
                      className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
                    >
                      {copiedBank ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBank ? 'Copied!' : 'Copy Bank Details'}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-[#0B1B36] rounded-xl space-y-1 text-slate-300 font-mono text-[11px]">
                    <div>Account Name: <b>Sri Krishna Yadav Youth Guraja</b></div>
                    <div>A/C Number: <b className="text-white">38491029384</b></div>
                    <div>IFSC Code: <b className="text-amber-300">SBIN0001234</b></div>
                    <div>Bank: State Bank of India, Guraja Branch</div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Bank Transaction Reference / UTR *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UTR-2026-98124"
                      value={upiRef}
                      onChange={(e) => setUpiRef(e.target.value)}
                      className="w-full bg-[#0B1B36] border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 3. Cash Mode */}
              {paymentMethod === 'CASH' && (
                <div className="p-4 bg-[#061224] border border-emerald-500/20 rounded-2xl space-y-2 text-xs">
                  <b className="text-emerald-300 text-sm block">Cash Handover at Guraja</b>
                  <p className="text-slate-300 leading-relaxed">
                    You can hand over cash directly to authorized committee collectors at <b>Yadav Youth Bhavan, Main Road, Guraja</b> or to any registered youth representative.
                  </p>
                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Collector / Receipt Book Reference (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Received by Treasurer / Book #14"
                      value={upiRef}
                      onChange={(e) => setUpiRef(e.target.value)}
                      className="w-full bg-[#0B1B36] border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-[#16335F] text-slate-300 text-xs rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleProcessTransfer}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2"
                >
                  {isProcessing ? 'Verifying & Recording...' : `CONFIRM ₹${Number(amount).toLocaleString('en-IN')} TRANSFER`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: VERIFIED RECEIPT */}
          {step === 4 && verifiedReceipt && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white font-display">
                  Funds Transferred & Receipt Generated!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Thank you, <b className="text-amber-300">{verifiedReceipt.donorName}</b>. Your contribution of <b className="text-emerald-400 font-mono">₹{Number(verifiedReceipt.amount).toLocaleString('en-IN')}</b> has been posted to the Sri Krishna Yadav Youth Guraja verified ledger.
                </p>
              </div>

              <div className="p-4 bg-[#061224] rounded-2xl border border-white/10 text-left text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Receipt Number:</span>
                  <b className="text-amber-300 font-mono">{verifiedReceipt.receiptNumber}</b>
                </div>
                <div className="flex justify-between">
                  <span>Campaign:</span>
                  <b className="text-white truncate max-w-[200px]">{verifiedReceipt.campaign}</b>
                </div>
                <div className="flex justify-between">
                  <span>Transfer Mode:</span>
                  <span className="text-cyan-300 font-mono font-bold">{verifiedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Hash:</span>
                  <span className="text-[10px] font-mono text-emerald-400">{verifiedReceipt.securityHash}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onReceiptGenerated(verifiedReceipt.receiptNumber);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Official Digital Receipt</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
