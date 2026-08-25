import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import { QRCodeSVG } from 'qrcode.react';
import { SkyLogo } from './SkyLogo';
import { X, Printer, Download, Share2, CheckCircle2, ShieldCheck, Building, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReceiptModalProps {
  receiptNumber: string | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receiptNumber, onClose }) => {
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (receiptNumber) {
      setLoading(true);
      setError(null);
      api.getReceipt(receiptNumber)
        .then((res) => {
          if (res.success) {
            setReceipt(res.data);
          } else {
            setError(res.message);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [receiptNumber]);

  if (!receiptNumber) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });
      const imgWidth = 148;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`SKY_Receipt_${receiptNumber}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `SKY Guraja Donation Receipt - ${receiptNumber}`,
        text: `Official donation receipt of ₹${receipt?.amount} from Sri Krishna Yadav Youth Guraja.`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Receipt verification link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0B1B36] border border-amber-500/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Actions Bar */}
        <div className="no-print px-5 py-3.5 bg-[#0E2447] border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-display">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AUTHENTIC DIGITAL RECEIPT</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#16335F] hover:bg-[#1E437C] text-xs text-white rounded-lg transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 bg-[#16335F] hover:bg-[#1E437C] text-slate-300 hover:text-white rounded-lg transition-all"
              title="Share receipt link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading authentic receipt...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-300 text-xs">{error}</div>
          ) : (
            <div
              ref={receiptRef}
              className="receipt-container bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border-4 border-[#0B1B36] relative overflow-hidden"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Subtle watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <span className="text-[120px] font-black text-slate-900 tracking-widest font-display">SKY</span>
              </div>

              {/* Receipt Header with Official Logo */}
              <div className="text-center pb-4 border-b-2 border-slate-900/20 relative">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <SkyLogo variant="icon" size="md" />
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-wider uppercase leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      SRI KRISHNA YADAV YOUTH GURAJA
                    </h3>
                    <p className="text-[10px] text-amber-900 font-extrabold tracking-widest uppercase mt-0.5">
                      Unity • Culture • Seva • Youth Power • Progress
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Yadav Youth Bhavan, Main Road, Guraja, Krishna Dist., AP - 521321
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Official Registration & Community Operations • Helpline: +91 98480 22334
                </p>
                <div className="mt-2 inline-block px-3 py-0.5 bg-amber-50 border border-amber-300 text-amber-900 font-bold text-[11px] uppercase tracking-wider rounded">
                  Official Contribution Receipt
                </div>
              </div>

              {/* Receipt Meta Row */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Receipt Number</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm tracking-wide">
                    {receipt.receipt_number}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Date of Issue</span>
                  <span className="font-medium text-slate-900 text-xs">
                    {receipt.date}
                  </span>
                </div>
              </div>

              {/* Donor & Payment Details */}
              <div className="py-4 space-y-2.5 text-xs border-b border-slate-200">
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Received with thanks from:</span>
                  <span className="font-bold text-slate-900 text-sm text-right">{receipt.donor_name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">For Campaign / Purpose:</span>
                  <span className="font-semibold text-slate-800 text-right">{receipt.campaign_name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Mode / Reference:</span>
                  <span className="font-mono text-slate-800 text-right">
                    {receipt.payment_method} {receipt.reference_no ? `• ${receipt.reference_no}` : ''}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Collected By:</span>
                  <span className="font-medium text-slate-800 text-right">{receipt.collector_name}</span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="my-4 p-3.5 bg-amber-50/80 border-2 border-amber-400/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">
                    Amount Received
                  </span>
                  <span className="text-xl font-black text-amber-950 font-mono">
                    ₹{Number(receipt.amount).toLocaleString('en-IN')}/-
                  </span>
                </div>
                <div className="text-right max-w-[65%]">
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">In Words</span>
                  <span className="text-xs font-semibold text-amber-950 italic block leading-tight">
                    {receipt.amountInWords}
                  </span>
                </div>
              </div>

              {/* Footer with QR Code & Authorized Signature */}
              <div className="pt-2 flex items-center justify-between">
                {/* QR Code */}
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-white border border-slate-300 rounded-lg shadow-sm">
                    <QRCodeSVG
                      value={receipt.qr_code_data || receipt.receipt_number}
                      size={64}
                      level="M"
                    />
                  </div>
                  <div className="text-[9px] text-slate-500 leading-tight">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tamper-Evident QR
                    </span>
                    <span>Scan to verify ledger validity</span>
                    <span className="font-mono block text-[8px] text-slate-400 mt-0.5">
                      Hash: {receipt.security_hash}
                    </span>
                  </div>
                </div>

                {/* Signature Block */}
                <div className="text-center">
                  <div className="w-32 h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                    <span className="text-[9px] text-slate-400 font-mono italic">Sri Krishna Yadav Youth</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block mt-1">
                    Authorized Signatory
                  </span>
                  <span className="text-[8px] text-slate-500 block">Treasurer / President Office</span>
                </div>
              </div>

              {/* Receipt Footer Notice */}
              <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400">
                This is a computer-generated digital receipt with cryptographic verification. Every rupee is auditable.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
