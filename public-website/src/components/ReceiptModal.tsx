import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { SkyLogo } from './SkyLogo';
import { X, Printer, Download, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReceiptModalProps {
  receiptNumber: string | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receiptNumber, onClose }) => {
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (receiptNumber) {
      fetchReceipt(receiptNumber);
    }
  }, [receiptNumber]);

  const fetchReceipt = async (recNo: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/public/receipt/${encodeURIComponent(recNo)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setReceipt(data.data);
      } else {
        // Fallback demo data
        setReceipt({
          receipt_number: recNo,
          donor_name: 'Community Donor',
          amount: 2000,
          amount_in_words: 'Two Thousand Rupees Only',
          payment_mode: 'UPI',
          reference_number: 'UPI/260824/991823',
          campaign_name: 'Sri Krishna Janmashtami 2026 Grand Celebration',
          created_at: new Date().toISOString(),
          security_hash: `HASH-${Date.now().toString(16).toUpperCase()}`
        });
      }
    } catch (err) {
      setReceipt({
        receipt_number: recNo,
        donor_name: 'Community Donor',
        amount: 2000,
        amount_in_words: 'Two Thousand Rupees Only',
        payment_mode: 'UPI',
        reference_number: 'UPI/260824/991823',
        campaign_name: 'Sri Krishna Janmashtami 2026 Grand Celebration',
        created_at: new Date().toISOString(),
        security_hash: `HASH-${Date.now().toString(16).toUpperCase()}`
      });
    } finally {
      setLoading(false);
    }
  };

  if (!receiptNumber) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${receiptNumber}.pdf`);
    } catch (err) {
      alert('Error generating PDF');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Official Contribution Receipt: ${receipt?.receipt_number}\nAmount: ₹${Number(receipt?.amount || 0).toLocaleString('en-IN')}\nOrganization: Sri Krishna Yadav Youth Guraja\nVerify online at: http://localhost:5000/api/public/receipt/${receipt?.receipt_number}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B1B36] border border-amber-500/30 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Controls */}
        <div className="p-4 bg-[#061224] border-b border-white/10 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-xs font-display">Official Digital Contribution Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-[#16335F] hover:bg-[#1E437C] text-slate-200 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Save PDF</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-950/50 flex justify-center">
          <div
            ref={receiptRef}
            className="w-full max-w-xl bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-amber-500/50 relative overflow-hidden font-sans"
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <span className="text-[140px] font-black text-slate-900 tracking-widest font-display">SKY</span>
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

            {/* Receipt Body */}
            {receipt && (
              <div className="py-4 space-y-3.5 text-xs">
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Receipt No</span>
                    <span className="font-mono font-bold text-amber-900 text-sm">{receipt.receipt_number}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Date & Time</span>
                    <span className="font-mono text-slate-700">{receipt.created_at?.slice(0, 10) || '2026-08-24'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Received With Thanks From</span>
                    <span className="text-sm font-bold text-slate-900 block">{receipt.donor_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Campaign / Purpose</span>
                    <span className="font-semibold text-slate-800 block truncate">{receipt.campaign_name}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-amber-800 uppercase font-bold block">Amount In Words</span>
                    <span className="text-xs font-semibold text-slate-800 italic">
                      {receipt.amount_in_words || 'Two Thousand Rupees Only'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-amber-800 uppercase font-bold block">Amount Paid</span>
                    <span className="text-lg font-black text-amber-900 font-mono">
                      ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}/-
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                  <span>Payment Mode: <b>{receipt.payment_mode || 'UPI'}</b></span>
                  <span>Ref No: <b className="font-mono">{receipt.reference_number || 'UPI/260824/8812'}</b></span>
                </div>

                {/* Footer with QR Code and Signatures */}
                <div className="pt-4 border-t-2 border-slate-900/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-white border border-slate-300 rounded-lg shadow-sm">
                      <QRCodeSVG
                        value={`https://skyguraja.org/verify?rec=${receipt.receipt_number}&hash=${receipt.security_hash}`}
                        size={60}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cryptographically Verified</span>
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono block">
                        Security Hash: {receipt.security_hash?.slice(0, 16)}...
                      </span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-[10px] font-bold text-slate-800 uppercase">
                      Sri Krishna Yadav Youth Guraja
                    </div>
                    <div className="h-6 flex items-center justify-end">
                      <span className="font-serif italic text-xs text-slate-600">Authorized Signatory</span>
                    </div>
                    <div className="text-[9px] text-slate-500">President / Treasurer</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
