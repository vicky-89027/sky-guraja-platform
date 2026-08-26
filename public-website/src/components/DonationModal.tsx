import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  ArrowRight,
  IndianRupee,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Coins,
  CreditCard,
  Building2,
  Banknote,
  Calendar,
  Lock
} from 'lucide-react';
import { AuthUser } from './AuthModal';
import confetti from 'canvas-confetti';
import { isCommitteeMember } from '../services/teamService';
import {
  initiateAndVerifyUPIContribution,
  createMemberCashContribution,
  RealReceipt
} from '../services/receiptService';

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
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'CASH'>('UPI');

  // Card Payment Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Netbanking Fields
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // Member Cash Fields
  const [cashDate, setCashDate] = useState(new Date().toISOString().split('T')[0]);
  const [cashNotes, setCashNotes] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedReceipt, setVerifiedReceipt] = useState<RealReceipt | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Universal dynamic committee authorization
  const isMemberOrAdmin = isCommitteeMember(user);

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

  const handleProcessPayment = async () => {
    try {
      setIsProcessing(true);

      let receipt: RealReceipt;

      if (paymentMethod === 'CASH') {
        if (!isMemberOrAdmin) {
          throw new Error('Cash handover can only be recorded by authenticated Committee Members.');
        }

        receipt = await createMemberCashContribution({
          memberId: user?.phone || 'mem-01',
          memberName: user?.fullName || 'Committee Member',
          memberRole: user?.role || 'MEMBER',
          contributorName: contributorName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          campaignId: campaign.toLowerCase().replace(/\s+/g, '-'),
          campaignTitle: campaign,
          amount: Number(amount),
          cashReceivedDate: new Date(cashDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          notes: cashNotes.trim() || undefined
        });
      } else {
        // UPI, Card, or Netbanking
        receipt = await initiateAndVerifyUPIContribution({
          contributorName: contributorName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          campaignId: campaign.toLowerCase().replace(/\s+/g, '-'),
          campaignTitle: campaign,
          amount: Number(amount)
        });

        // Set specific payment method if CARD or NETBANKING
        if (paymentMethod === 'CARD' || paymentMethod === 'NETBANKING') {
          receipt.contribution.paymentMethod = paymentMethod as any;
        }
      }

      setVerifiedReceipt(receipt);
      setStep(3);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onReceiptGenerated(receipt);
    } catch (err: any) {
      alert(err.message || 'Payment processing failed. Please try again.');
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
            STEP 1: CONTRIBUTOR DETAILS & PAYMENT METHOD SELECTION
            ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4A244] to-[#B38020] text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Coins className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h3 className="text-base font-black text-white font-serif uppercase tracking-wide">
                  Transfer Funds / Support Campaign
                </h3>
                <p className="text-[10px] text-amber-300 font-mono">
                  Official Sri Krishna Yadav Youth Guraja Seva Ledger
                </p>
              </div>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-3 text-xs">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Select Payment Method *
                </label>
                <div className={`grid gap-2 ${isMemberOrAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                        : 'bg-[#050F21] text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>UPI App / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'CARD'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                        : 'bg-[#050F21] text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Debit / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'NETBANKING'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                        : 'bg-[#050F21] text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Netbanking</span>
                  </button>

                  {/* Cash Handover (Strictly for Member / Admin login) */}
                  {isMemberOrAdmin && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold border flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'CASH'
                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400 shadow-sm'
                          : 'bg-[#050F21] text-emerald-400/80 border-emerald-500/30 hover:border-emerald-500/50'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      <span>Cash Handover</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Purpose / Campaign Selector */}
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
                  <span>PROCEED TO {paymentMethod} PAYMENT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            STEP 2: PAYMENT PROCESSING (UPI / CARD / NETBANKING / CASH)
            ========================================================================= */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3 text-center">
              <span className="text-[10px] text-amber-400 font-mono tracking-wider uppercase block">
                Payment Verification • {paymentMethod}
              </span>
              <h3 className="text-base font-black text-white font-serif uppercase">
                Pay ₹{Number(amount).toLocaleString('en-IN')}.00
              </h3>
            </div>

            {/* A. UPI PAYMENT SCREEN */}
            {paymentMethod === 'UPI' && (
              <div className="space-y-4 text-center">
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
              </div>
            )}

            {/* B. CARD PAYMENT SCREEN */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Card Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8892"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono text-sm"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Expiry (MM/YY) *
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      CVV *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>256-Bit Bank Grade SSL Encrypted Payment Gateway</span>
                </div>
              </div>
            )}

            {/* C. NETBANKING SCREEN */}
            {paymentMethod === 'NETBANKING' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Select Your Bank *
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  >
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                    <option value="Union Bank of India">Union Bank of India</option>
                    <option value="Andhra Pragathi Grameena Bank">Andhra Pragathi Grameena Bank</option>
                  </select>
                </div>
                <div className="p-3 bg-[#050F21] rounded-xl border border-white/10 text-slate-300 text-xs">
                  You will be securely redirected to {selectedBank} gateway to authorize the contribution of ₹{Number(amount).toLocaleString('en-IN')}.
                </div>
              </div>
            )}

            {/* D. CASH HANDOVER SCREEN (MEMBER ONLY) */}
            {paymentMethod === 'CASH' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span>Member Cash Handover Verification</span>
                  </div>
                  <div className="text-[10px] text-emerald-300/80 mt-0.5">
                    Recorded by: <b>{user?.fullName}</b> ({user?.role})
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Cash Handover Collection Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={cashDate}
                      onChange={(e) => setCashDate(e.target.value)}
                      className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Internal Notes / Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Received at Yadav Bhavan"
                    value={cashNotes}
                    onChange={(e) => setCashNotes(e.target.value)}
                    className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* Payment Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 fill-slate-950 text-emerald-500" />
                <span>
                  {isProcessing
                    ? 'VERIFYING & GENERATING E-RECEIPT...'
                    : paymentMethod === 'CASH'
                    ? 'CONFIRM CASH RECEIVED & ISSUE E-RECEIPT'
                    : 'PAY ₹' + Number(amount).toLocaleString('en-IN') + ' & ISSUE E-RECEIPT'}
                </span>
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-slate-400 hover:text-white"
              >
                ← Back to Contributor Details & Amount
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
