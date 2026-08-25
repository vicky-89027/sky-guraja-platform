import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Calendar,
  CreditCard,
  Building,
  User,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { verifyReceiptByToken, VerificationResult, RealReceipt, getRealReceiptsList } from '../services/receiptService';
import { SkyLogo } from '../components/SkyLogo';

interface ReceiptVerificationPageProps {
  token: string;
  onBack: () => void;
  onOpenReceiptModal: (receipt: RealReceipt) => void;
}

export const ReceiptVerificationPage: React.FC<ReceiptVerificationPageProps> = ({
  token,
  onBack,
  onOpenReceiptModal
}) => {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate brief secure verification handshake
    const timer = setTimeout(() => {
      const res = verifyReceiptByToken(token);
      setResult(res);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [token]);

  const handleViewFullReceipt = () => {
    if (!result || !result.receiptNumber) return;
    const all = getRealReceiptsList();
    const found = all.find((r) => r.receiptNumber === result.receiptNumber || r.verificationToken === token);
    if (found) {
      onOpenReceiptModal(found);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#050E1C] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#08152B] hover:bg-[#12274A] border border-white/15 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Verification Card */}
        <div className="bg-[#08152B] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 text-center sm:text-left">
            <SkyLogo variant="horizontal" size="sm" />
            <div className="text-right">
              <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase block">
                Official Verification Ledger
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Sri Krishna Yadav Youth Guraja
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-bold text-amber-300 font-mono">
                Verifying Cryptographic E-Receipt Token...
              </div>
            </div>
          ) : result && result.valid ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Verified Badge */}
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-emerald-300 uppercase tracking-wide font-display">
                    ✓ AUTHENTIC E-RECEIPT VERIFIED
                  </div>
                  <div className="text-xs text-emerald-200/80 leading-relaxed">
                    This receipt is verified and recorded with permanent financial integrity in the official Guraja community ledger.
                  </div>
                </div>
              </div>

              {/* Verified Record Details Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#050F21] rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Receipt Number</span>
                  </div>
                  <div className="text-base font-black font-mono text-amber-300">
                    {result.receiptNumber}
                  </div>
                </div>

                <div className="p-3.5 bg-[#050F21] rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contribution Amount</span>
                  </div>
                  <div className="text-base font-black font-mono text-white">
                    ₹ {result.amount?.toLocaleString('en-IN')}.00
                  </div>
                  <div className="text-[10px] text-amber-400 italic">
                    {result.amountInWords}
                  </div>
                </div>

                <div className="p-3.5 bg-[#050F21] rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contributor (Privacy-Masked)</span>
                  </div>
                  <div className="font-bold text-white text-sm">
                    {result.contributorName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Mobile: {result.maskedPhone}
                  </div>
                </div>

                <div className="p-3.5 bg-[#050F21] rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Payment Method & Txn</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                      {result.paymentMethod}
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 truncate max-w-[140px]">
                      {result.transactionId}
                    </span>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 p-3.5 bg-[#050F21] rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Purpose & Date</span>
                  </div>
                  <div className="font-bold text-amber-200 text-sm">
                    {result.campaignTitle}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Issued on <span className="text-white font-semibold">{result.issueDate}</span> at <span className="text-white font-semibold">{result.issueTime}</span>
                  </div>
                </div>
              </div>

              {/* View Full E-Receipt Button */}
              <button
                onClick={handleViewFullReceipt}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:from-[#E5B869] transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>VIEW FULL OFFICIAL E-RECEIPT (A4 / PRINT / PDF)</span>
              </button>
            </div>
          ) : result && result.status === 'VOIDED' ? (
            <div className="p-6 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-center space-y-3">
              <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
              <h3 className="text-lg font-black text-rose-400 uppercase">
                RECEIPT VOIDED
              </h3>
              <p className="text-xs text-rose-200/90 max-w-md mx-auto">
                {result.message}
              </p>
            </div>
          ) : (
            <div className="p-6 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-center space-y-3">
              <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
              <h3 className="text-lg font-black text-rose-400 uppercase">
                INVALID / UNVERIFIED TOKEN
              </h3>
              <p className="text-xs text-rose-200/90 max-w-md mx-auto">
                {result?.message || 'No authentic institutional record matches this QR token. Please check with Sri Krishna Yadav Youth Guraja administration.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptVerificationPage;
