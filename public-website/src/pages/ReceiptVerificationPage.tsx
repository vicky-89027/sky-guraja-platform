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
  ArrowLeft,
  Download,
  Printer,
  ShieldCheck,
  Sparkles,
  Coins
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { verifyReceiptByToken, VerificationResult, RealReceipt, getRealReceiptsList } from '../services/receiptService';
import { downloadReceiptPDF } from '../services/receiptPdfService';
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
  const [fullReceipt, setFullReceipt] = useState<RealReceipt | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const res = verifyReceiptByToken(token);
      setResult(res);

      if (res.valid) {
        const all = getRealReceiptsList();
        const found = all.find(
          (r) => r.receiptNumber === res.receiptNumber || r.verificationToken === token
        );
        if (found) {
          setFullReceipt(found);
        } else {
          // Construct fallback receipt object for PDF export if not found in local array
          setFullReceipt({
            id: `rec-${token.slice(-8)}`,
            receiptNumber: res.receiptNumber || 'SKYG/26-27/000001',
            contributionId: `con-${token.slice(-8)}`,
            verificationToken: token,
            qrCodeUrl: `https://sky-guraja-app.vercel.app/?verify=${token}`,
            issueDate: res.issueDate || new Date().toLocaleDateString('en-IN'),
            issueTime: res.issueTime || new Date().toLocaleTimeString('en-IN'),
            status: 'ISSUED',
            signatoryTitle: 'President & Treasurer',
            contribution: {
              id: `con-${token.slice(-8)}`,
              contributorName: res.contributorName || 'Devotee',
              phone: res.maskedPhone || '',
              email: res.maskedEmail || undefined,
              address: res.address || 'Guraja Village, Andhra Pradesh',
              campaignId: 'c1',
              campaignTitle: res.campaignTitle || 'Janmashtami Mahotsavam',
              amount: res.amount || 0,
              amountInWords: res.amountInWords || 'Rupees Only',
              paymentMethod: (res.paymentMethod as any) || 'UPI',
              status: 'VERIFIED',
              createdAt: new Date().toISOString(),
              transactionId: res.transactionId,
              referenceNo: res.referenceNo
            }
          });
        }
      }

      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-3xl space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Website</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Public Verification Portal</span>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-lg space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-base font-bold text-slate-900 font-serif">
              Verifying Cryptographic E-Receipt Record...
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Auditing against Sri Krishna Yadav Youth Guraja immutable ledger
            </p>
          </div>
        ) : result && result.valid ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Authenticity Verified Banner */}
            <div className="p-4 sm:p-5 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm sm:text-base font-black text-emerald-950 font-serif uppercase tracking-wide">
                  ✓ AUTHENTIC E-RECEIPT OFFICIALLY VERIFIED
                </div>
                <div className="text-xs text-emerald-800 leading-relaxed">
                  This contribution is verified, immutable, and accounted for in the Sri Krishna Yadav Youth Guraja financial ledger.
                </div>
              </div>
            </div>

            {/* FULL OFFICIAL E-RECEIPT CARD */}
            <div
              id="printable-verified-receipt"
              className="bg-white border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-slate-900 print:border print:m-0 print:p-6"
            >
              {/* Gold Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#B38020] via-[#F5BD55] to-[#D4A244]" />

              {/* Letterhead Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-slate-200 text-center sm:text-left">
                <div className="flex items-center gap-3.5">
                  <SkyLogo variant="icon" size="md" />
                  <div>
                    <h1 className="font-serif font-black text-base sm:text-lg text-slate-950 uppercase tracking-wide">
                      Sri Krishna Yadav Youth Guraja
                    </h1>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Guraja Village, Mudinepalli Mandal, Eluru District, Andhra Pradesh - 521321
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Official Transparency Portal • Double-Entry Verified
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-black rounded-lg inline-block mb-1">
                    OFFICIAL E-RECEIPT
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-900">
                    No: <span className="text-amber-700">{result.receiptNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Date: {result.issueDate} • {result.issueTime}
                  </div>
                </div>
              </div>

              {/* Donor & Contribution Particulars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6 text-xs sm:text-sm">
                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Devotee / Contributor Particulars
                  </span>
                  <div className="font-bold text-base text-slate-950">
                    {result.contributorName}
                  </div>
                  <div className="text-slate-600 font-mono">
                    Mobile: {result.maskedPhone}
                  </div>
                  {result.maskedEmail && (
                    <div className="text-slate-600">Email: {result.maskedEmail}</div>
                  )}
                  <div className="text-slate-600">Address: {result.address || 'Guraja Village, Andhra Pradesh'}</div>
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Contribution Particulars
                  </span>
                  <div className="font-bold text-slate-900">
                    Cause: {result.campaignTitle}
                  </div>
                  <div className="text-slate-600">
                    Payment Mode:{' '}
                    <span className="font-bold text-slate-900">
                      {result.paymentMethod === 'UPI' ? 'UPI Online Transfer' : 'Cash Handover'}
                    </span>
                  </div>
                  <div className="text-slate-600 font-mono text-[11px]">
                    Txn ID: {result.transactionId}
                  </div>
                  <div className="text-slate-600 font-mono text-[11px]">
                    Ref No: {result.referenceNo}
                  </div>
                </div>
              </div>

              {/* Amount Highlight Box */}
              <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-500/40 rounded-2xl text-center my-6">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  Total Contribution Amount
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-black text-slate-950">
                  ₹{result.amount?.toLocaleString('en-IN')}.00
                </div>
                <div className="mt-1 font-serif italic text-xs sm:text-sm text-slate-700">
                  {result.amountInWords}
                </div>
              </div>

              {/* Footer with QR Code & Authorized Seal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-slate-200">
                {/* QR Code */}
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl border-2 border-slate-300 shadow-sm">
                    <QRCodeSVG
                      value={`https://sky-guraja-app.vercel.app/?verify=${token}`}
                      size={76}
                      level="H"
                    />
                  </div>
                  <div className="text-left text-[11px]">
                    <span className="font-bold text-slate-900 block">Tamper-Proof QR Verification</span>
                    <span className="text-slate-500 font-mono block">Token: {token.slice(0, 16)}...</span>
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {fullReceipt && (
                <button
                  type="button"
                  onClick={() => downloadReceiptPDF(fullReceipt)}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 fill-slate-950" />
                  <span>Download Official PDF E-Receipt</span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePrint}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Coins className="w-4 h-4" />
                <span>Make a Contribution</span>
              </button>
            </div>
          </div>
        ) : result && result.status === 'VOIDED' ? (
          <div className="p-8 bg-rose-50 border-2 border-rose-300 rounded-3xl text-center space-y-3 shadow-md">
            <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
            <h2 className="text-xl font-black text-rose-950 uppercase font-serif">
              RECEIPT OFFICIALLY VOIDED
            </h2>
            <p className="text-xs text-rose-800 max-w-md mx-auto">
              {result.message}
            </p>
          </div>
        ) : (
          <div className="p-8 bg-rose-50 border-2 border-rose-300 rounded-3xl text-center space-y-3 shadow-md">
            <XCircle className="w-12 h-12 text-rose-600 mx-auto" />
            <h2 className="text-xl font-black text-rose-950 uppercase font-serif">
              INVALID / UNVERIFIED TOKEN
            </h2>
            <p className="text-xs text-rose-800 max-w-md mx-auto">
              {result?.message || 'No authentic institutional record matches this QR token. Please check with Sri Krishna Yadav Youth Guraja administration.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptVerificationPage;
