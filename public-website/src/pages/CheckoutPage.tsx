import React, { useState, useEffect } from 'react';
import {
  Coins,
  ShieldCheck,
  Lock,
  Unlock,
  QrCode,
  IndianRupee,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Printer,
  Download,
  ExternalLink,
  Copy,
  Sparkles,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Building,
  HeartHandshake,
  FileText,
  BadgeCheck,
  Info
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { SkyLogo } from '../components/SkyLogo';
import { AuthUser } from '../components/AuthModal';
import { isCommitteeMember } from '../services/teamService';
import {
  initiateAndVerifyUPIContribution,
  createMemberCashContribution,
  amountToWords,
  RealReceipt
} from '../services/receiptService';

interface CheckoutPageProps {
  user: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'register', prompt?: string, intent?: string) => void;
  onNavigateHome: () => void;
  initialCampaignTitle?: string;
}

const PRESET_AMOUNTS = [501, 1116, 2116, 5116, 11116, 25000, 51000];

const CAMPAIGNS_LIST = [
  { id: 'c1', title: 'Sri Krishna Janmashtami Mahotsavam & Utlotsavam 2026' },
  { id: 'c2', title: 'Guraja Youth Community Seva & Village Upliftment' },
  { id: 'c3', title: 'Sri Krishna Swamy Temple Gopuram & Mandapam Renovation' },
  { id: 'c4', title: 'Daily Temple Annadanam & Prasadam Trust' },
  { id: 'c5', title: 'Youth Sports Equipment & Community Ground Fund' },
  { id: 'c6', title: 'General Village Welfare & Emergency Seva Fund' }
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  user,
  onOpenAuth,
  onNavigateHome,
  initialCampaignTitle
}) => {
  // Form State
  const [donorName, setDonorName] = useState(user?.fullName || '');
  const [donorPhone, setDonorPhone] = useState(user?.phone || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [donorAddress, setDonorAddress] = useState('Guraja Village, Andhra Pradesh');
  const [selectedCampaign, setSelectedCampaign] = useState(
    initialCampaignTitle || CAMPAIGNS_LIST[0].title
  );
  const [amount, setAmount] = useState<number>(1116);
  const [customAmountStr, setCustomAmountStr] = useState<string>('1116');

  // Payment Method: 'UPI' or 'CASH'
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH'>('UPI');

  // Cash Handover specific state (for members)
  const [cashReference, setCashReference] = useState('');
  const [cashNotes, setCashNotes] = useState('');

  // Processing & Receipt
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<RealReceipt | null>(null);

  // Check if current user is an authorized committee member (auto-grants to all existing and new members)
  const isAuthorizedMember = isCommitteeMember(user);

  // If user state changes, pre-fill details
  useEffect(() => {
    if (user) {
      if (!donorName) setDonorName(user.fullName);
      if (!donorPhone) setDonorPhone(user.phone);
      if (!donorEmail && user.email) setDonorEmail(user.email);
    }
  }, [user]);

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmountStr(String(val));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountStr(raw);
    const num = Number(raw);
    setAmount(num > 0 ? num : 0);
  };

  const upiId = 'skyguraja@sbi';
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=Sri%20Krishna%20Yadav%20Youth%20Guraja&am=${amount}&cu=INR&tn=${encodeURIComponent(
    `Seva: ${selectedCampaign.slice(0, 25)}`
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!donorName.trim()) {
      setErrorMessage('Please enter Donor Full Name.');
      return;
    }

    const cleanPhone = donorPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for SMS receipt.');
      return;
    }

    if (amount <= 0) {
      setErrorMessage('Contribution amount must be greater than ₹0.');
      return;
    }

    if (paymentMethod === 'CASH' && !isAuthorizedMember) {
      setErrorMessage('Cash Handover is strictly restricted to verified Committee Members.');
      return;
    }

    setIsSubmitting(true);

    try {
      let receipt: RealReceipt;

      if (paymentMethod === 'UPI') {
        receipt = await initiateAndVerifyUPIContribution({
          contributorName: donorName.trim(),
          phone: cleanPhone,
          email: donorEmail.trim() || undefined,
          address: donorAddress.trim() || 'Guraja Village, Andhra Pradesh',
          campaignId: 'c1',
          campaignTitle: selectedCampaign,
          amount
        });
      } else {
        // CASH HANDOVER (Authorized Member)
        receipt = await createMemberCashContribution({
          memberId: user?.id || 'mem-auth',
          memberName: user?.fullName || 'Authorized Committee Member',
          memberRole: user?.role || 'MEMBER',
          contributorName: donorName.trim(),
          phone: cleanPhone,
          email: donorEmail.trim() || undefined,
          address: donorAddress.trim() || 'Guraja Village, Andhra Pradesh',
          campaignId: 'c1',
          campaignTitle: selectedCampaign,
          amount,
          internalReference: cashReference.trim() || undefined,
          notes: cashNotes.trim() || undefined
        });
      }

      setCompletedReceipt(receipt);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setErrorMessage('');
    const cleanPhone = donorPhone.replace(/[^0-9]/g, '');

    if (!donorName.trim() || cleanPhone.length < 10) {
      setErrorMessage('Please enter your full name and a valid 10-digit mobile number.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    if (!amount || amount <= 0) {
      setErrorMessage('Contribution amount must be greater than ₹0.');
      return;
    }

    const rzpKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_live_craftory';

    if (typeof (window as any).Razorpay !== 'undefined') {
      try {
        setIsSubmitting(true);
        const options = {
          key: rzpKey,
          amount: Math.round(amount * 100),
          currency: 'INR',
          name: 'Craftory',
          description: `${selectedCampaign} • SKY Guraja`,
          image: '/images/sky_official_monogram.png',
          prefill: {
            name: donorName.trim(),
            contact: cleanPhone,
            email: donorEmail.trim() || `${cleanPhone}@skyguraja.org`
          },
          notes: {
            organization: 'Sri Krishna Yadav Youth Guraja',
            campaign: selectedCampaign,
            merchant: 'Craftory'
          },
          theme: {
            color: '#D4A244'
          },
          handler: async function (response: any) {
            try {
              const receipt = await initiateAndVerifyUPIContribution({
                contributorName: donorName.trim(),
                phone: cleanPhone,
                email: donorEmail.trim() || undefined,
                address: donorAddress.trim() || 'Guraja Village, Andhra Pradesh',
                campaignId: 'c1',
                campaignTitle: selectedCampaign,
                amount
              });
              setCompletedReceipt(receipt);
              confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err: any) {
              setErrorMessage(err.message || 'Payment recorded, receipt generation failed.');
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setErrorMessage(response?.error?.description || 'Razorpay transaction was cancelled or failed.');
          setIsSubmitting(false);
        });
        rzp.open();
        return;
      } catch (err: any) {
        setErrorMessage('Failed to launch Razorpay gateway. Falling back to direct QR.');
      }
    }

    // Direct fallback
    handleSubmitContribution({ preventDefault: () => {} } as any);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleResetForNew = () => {
    setCompletedReceipt(null);
    setCustomAmountStr('1116');
    setAmount(1116);
    setPaymentMethod('UPI');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 selection:bg-amber-500 selection:text-slate-950">
      {/* Header Banner - White & Deep Navy Gradient with Gold Accents */}
      <div className="relative bg-[#050E1C] border-b border-amber-500/30 py-10 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden shadow-xl">
        {/* Subtle Background Backdrop */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-screen"
          style={{ backgroundImage: `url('/images/team_header_krishna_bg.png')` }}
        />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          {/* Official Logo */}
          <div className="mb-4">
            <SkyLogo variant="full" size="md" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Funds Collection & Instant E-Receipt Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 tracking-tight">
            Checkout & Verified Contributions
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Empower Guraja temple cultural festivals, daily Annadanam, and youth community welfare. Every rupee is recorded in our double-entry verified transparent ledger.
          </p>

          {/* Trust Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Verified Ledger
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              <QrCode className="w-4 h-4 text-amber-400" />
              Instant Digital QR E-Receipt
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
              Audited by Committee
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area - Clean White Theme */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {!completedReceipt ? (
          /* =========================================================================
             CHECKOUT FORM VIEW
             ========================================================================= */
          <form onSubmit={handleSubmitContribution} className="space-y-8">
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm animate-shake shadow-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Required Information: </span>
                  {errorMessage}
                </div>
              </div>
            )}

            {/* 1. SEVA CAMPAIGN SELECTOR */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Select Seva Cause / Campaign</h2>
                  <p className="text-xs text-slate-500">Choose the specific initiative your contribution will support.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                {CAMPAIGNS_LIST.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedCampaign(c.title)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-start justify-between gap-2 ${
                      selectedCampaign === c.title
                        ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 text-slate-900 font-bold shadow-sm'
                        : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-xs sm:text-sm leading-snug">{c.title}</span>
                    {selectedCampaign === c.title && (
                      <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. DONOR DETAILS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Donor Information</h2>
                  <p className="text-xs text-slate-500">Your details will be printed on the official digital E-Receipt.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                {/* Donor Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Donor Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sri Rama Krishna Yadav / Family Gotram"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-2.5 flex items-center gap-1 text-slate-500 font-semibold text-sm">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98480 12345"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-16 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Used for instant SMS & WhatsApp receipt link.</span>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-medium text-slate-900 transition-all outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">PDF copy will be emailed directly.</span>
                </div>

                {/* Address / Native Village */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Village / City / Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Guraja Village, Andhra Pradesh"
                      value={donorAddress}
                      onChange={(e) => setDonorAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-medium text-slate-900 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. AMOUNT SELECTION */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Contribution Amount</h2>
                  <p className="text-xs text-slate-500">Select a suggested sacred offering or enter a custom amount.</p>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2.5 mt-5">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleAmountSelect(val)}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                      amount === val
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-500/30 transform scale-105'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    ₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="mt-5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Amount in INR (₹)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-slate-400 font-bold text-lg">₹</div>
                  <input
                    type="text"
                    required
                    placeholder="Enter amount"
                    value={customAmountStr}
                    onChange={handleCustomAmountChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl text-xl font-black text-slate-950 transition-all outline-none font-mono"
                  />
                </div>

                {/* Amount in Words */}
                <div className="mt-2.5 p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900 font-serif italic">
                  <span className="font-bold not-italic font-sans text-[11px] uppercase tracking-wider text-amber-800 mr-1.5">
                    In Words:
                  </span>
                  {amountToWords(amount)}
                </div>
              </div>
            </div>

            {/* 4. PAYMENT MODES (UPI & CASH HANDOVER) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-sm">
                  4
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Select Payment Mode</h2>
                  <p className="text-xs text-slate-500">Pay directly via UPI or record Cash Handover (Members only).</p>
                </div>
              </div>

              {/* Payment Mode Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {/* MODE 1: UPI (Open to Everyone) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                    paymentMethod === 'UPI'
                      ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base">UPI / Instant QR</div>
                        <div className="text-[11px] text-slate-500 font-medium">GPay, PhonePe, Paytm, BHIM, Any UPI App</div>
                      </div>
                    </div>
                    {paymentMethod === 'UPI' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex">
                    <Sparkles className="w-3.5 h-3.5" />
                    Instant E-Receipt with Official QR
                  </div>
                </button>

                {/* MODE 2: CASH HANDOVER (Restricted to Member Login) */}
                <div
                  onClick={() => {
                    if (isAuthorizedMember) {
                      setPaymentMethod('CASH');
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                    !isAuthorizedMember
                      ? 'bg-slate-100/80 border-slate-300 opacity-80 cursor-not-allowed'
                      : paymentMethod === 'CASH'
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md cursor-pointer'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                          isAuthorizedMember ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white'
                        }`}
                      >
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                          <span>Cash Handover</span>
                          {!isAuthorizedMember ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Member Only
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                              <Unlock className="w-2.5 h-2.5" /> Authorized
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">Physical cash received on ground</div>
                      </div>
                    </div>
                    {isAuthorizedMember && paymentMethod === 'CASH' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>

                  {!isAuthorizedMember && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAuth(
                            'login',
                            'Please sign in with your authorized Committee Member credentials to enable Cash Handover collection.',
                            'record_cash'
                          );
                        }}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 underline flex items-center gap-1"
                      >
                        <span>Sign In as Member to enable Cash Mode</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* PAYMENT DETAILS CONTENT */}
              {paymentMethod === 'UPI' ? (
                /* UPI PAYMENT DISPLAY */
                <div className="mt-6 p-6 bg-[#08152B] rounded-2xl border border-amber-500/40 text-white shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* QR Code Container */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner text-slate-900">
                      <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 mb-2">
                        Scan with Any UPI App
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <QRCodeSVG value={upiPayUrl} size={160} level="H" includeMargin />
                      </div>
                      <div className="mt-2 text-center">
                        <span className="font-mono text-xs font-black text-slate-900 block">
                          ₹{amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500">Sri Krishna Yadav Youth Guraja</span>
                      </div>
                    </div>

                    {/* UPI App Buttons & VPA details */}
                    <div className="md:col-span-7 space-y-4 text-left">
                      <div>
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                          Official Committee UPI VPA
                        </span>
                        <div className="flex items-center gap-2 p-2.5 bg-white/10 rounded-xl border border-white/20 font-mono text-sm font-bold text-white">
                          <span className="flex-1 truncate">{upiId}</span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-all flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Razorpay Gateway Button (Craftory) */}
                      <div>
                        <button
                          type="button"
                          onClick={handleRazorpayPayment}
                          disabled={isSubmitting}
                          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Pay via Craftory Gateway (UPI / GPay / PhonePe / Paytm / Cards)</span>
                        </button>
                      </div>

                      {/* 1-Click Pay on Mobile */}
                      <div>
                        <span className="text-xs font-bold text-slate-300 block mb-2">
                          Direct App UPI Intent:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={upiPayUrl}
                            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl text-center shadow-sm flex items-center justify-center gap-1.5 transition-all"
                          >
                            <span>Google Pay / PhonePe</span>
                          </a>
                          <a
                            href={upiPayUrl}
                            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl text-center shadow-sm flex items-center justify-center gap-1.5 transition-all"
                          >
                            <span>Paytm / BHIM</span>
                          </a>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        After completing payment, your authenticated digital E-Receipt with sequential receipt number and QR verification seal will be issued immediately.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* CASH HANDOVER DETAILS (Members Only) */
                <div className="mt-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-300 text-slate-900">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Authorized Committee Member Cash Handover Verification</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Collecting Officer / Member Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value={`${user?.fullName} (${user?.role})`}
                        className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Handover / Voucher Reference No.
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CSH-GURAJA-001"
                        value={cashReference}
                        onChange={(e) => setCashReference(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-emerald-500 rounded-xl text-xs font-medium text-slate-900 outline-none font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Internal Handover Notes
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cash collected during village procession at Center"
                        value={cashNotes}
                        onChange={(e) => setCashNotes(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-emerald-500 rounded-xl text-xs font-medium text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. SUBMIT BUTTON & DISCLAIMER */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] hover:to-[#D4A244] text-slate-950 font-serif font-black text-base sm:text-lg tracking-wider uppercase rounded-2xl shadow-[0_0_30px_rgba(212,162,68,0.4)] transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing E-Receipt & Syncing Ledger...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 fill-slate-950" />
                    <span>
                      Complete {paymentMethod === 'UPI' ? 'UPI Contribution' : 'Cash Handover'} • ₹{amount.toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </button>

              <div className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sri Krishna Yadav Youth Guraja • Double-entry immutable financial ledger</span>
              </div>
            </div>
          </form>
        ) : (
          /* =========================================================================
             COMPLETED RECEIPT VIEW (OFFICIAL E-RECEIPT)
             ========================================================================= */
          <div className="space-y-6 animate-fadeIn">
            {/* Success Notification Banner */}
            <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl shadow-lg text-center text-slate-900">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-emerald-950">
                Contribution Successfully Recorded!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 max-w-md mx-auto">
                Thank you, <span className="font-bold">{completedReceipt.contribution.contributorName}</span>. Your support for <span className="font-bold">{completedReceipt.contribution.campaignTitle}</span> has been verified and posted to the Guraja financial ledger.
              </p>
            </div>

            {/* PRINTABLE OFFICIAL E-RECEIPT CARD */}
            <div
              id="printable-receipt"
              className="bg-white border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-slate-900 print:border print:m-0 print:p-6"
            >
              {/* Gold Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#B38020] via-[#F5BD55] to-[#D4A244]" />

              {/* Receipt Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-slate-200 text-center sm:text-left">
                <div className="flex items-center gap-3.5">
                  <SkyLogo variant="icon" size="md" />
                  <div>
                    <h3 className="font-serif font-black text-base sm:text-lg text-slate-950 uppercase tracking-wide">
                      Sri Krishna Yadav Youth Guraja
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Guraja Village, Andhra Pradesh, India • Reg. Youth & Cultural Society
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Transparency Portal: sky-guraja-app.vercel.app
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-black rounded-lg inline-block mb-1">
                    OFFICIAL E-RECEIPT
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-900">
                    No: <span className="text-amber-700">{completedReceipt.receiptNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Date: {completedReceipt.issueDate} • {completedReceipt.issueTime}
                  </div>
                </div>
              </div>

              {/* Donor & Contribution Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs sm:text-sm">
                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Donor Details
                  </span>
                  <div className="font-bold text-base text-slate-950">
                    {completedReceipt.contribution.contributorName}
                  </div>
                  <div className="text-slate-600 font-mono">
                    Phone: {completedReceipt.contribution.phone}
                  </div>
                  {completedReceipt.contribution.email && (
                    <div className="text-slate-600">Email: {completedReceipt.contribution.email}</div>
                  )}
                  <div className="text-slate-600">Address: {completedReceipt.contribution.address}</div>
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Contribution Particulars
                  </span>
                  <div className="font-bold text-slate-900">
                    Cause: {completedReceipt.contribution.campaignTitle}
                  </div>
                  <div className="text-slate-600">
                    Payment Mode:{' '}
                    <span className="font-bold text-slate-900">
                      {completedReceipt.contribution.paymentMethod === 'UPI' ? 'UPI Online Transfer' : 'Cash Handover'}
                    </span>
                  </div>
                  <div className="text-slate-600 font-mono text-[11px]">
                    Txn ID: {completedReceipt.contribution.transactionId}
                  </div>
                  <div className="text-slate-600 font-mono text-[11px]">
                    Ref No: {completedReceipt.contribution.referenceNo}
                  </div>
                </div>
              </div>

              {/* Amount Highlight Box */}
              <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-500/40 rounded-2xl text-center my-6">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  Total Amount Received
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-black text-slate-950">
                  ₹{completedReceipt.contribution.amount.toLocaleString('en-IN')}
                </div>
                <div className="mt-1 font-serif italic text-xs sm:text-sm text-slate-700">
                  {completedReceipt.contribution.amountInWords}
                </div>
              </div>

              {/* Footer with QR Code & Authorized Seal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-slate-200">
                {/* QR Code */}
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl border-2 border-slate-300 shadow-sm">
                    <QRCodeSVG
                      value={`https://sky-guraja-app.vercel.app/verify/receipt/${completedReceipt.verificationToken}`}
                      size={76}
                      level="H"
                    />
                  </div>
                  <div className="text-left text-[11px]">
                    <span className="font-bold text-slate-900 block">Tamper-Proof QR Verification</span>
                    <span className="text-slate-500 font-mono block">Token: {completedReceipt.verificationToken.slice(0, 16)}...</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Status: Officially Verified & Audited
                    </span>
                  </div>
                </div>

                {/* Authorized Signatory */}
                <div className="text-center sm:text-right">
                  <div className="inline-block border-b-2 border-slate-400 pb-1 px-6 font-serif italic text-slate-800 text-sm font-bold">
                    Sri Krishna Yadav Youth Committee
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider mt-1">
                    President / Treasurer • Sri Krishna Yadav Youth Guraja
                  </div>
                </div>
              </div>
            </div>

            {/* Post-Payment Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.open(
                    `/verify/receipt/${completedReceipt.verificationToken}`,
                    '_blank'
                  );
                }}
                className="px-6 py-3 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-slate-600" />
                <span>Open Public QR Verification</span>
              </button>

              <button
                type="button"
                onClick={handleResetForNew}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Coins className="w-4 h-4" />
                <span>Make Another Contribution</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
