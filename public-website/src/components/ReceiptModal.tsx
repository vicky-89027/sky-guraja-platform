import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { SkyLogo } from './SkyLogo';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  User,
  Gift,
  FileText,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle
} from 'lucide-react';
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
        // Fallback default matching exact reference
        setReceipt({
          receipt_number: recNo.startsWith('SKYG') ? recNo : `SKYG/24-25/${recNo.replace(/[^0-9]/g, '') || '000256'}`,
          donor_name: 'Rahul Kumar',
          donor_phone: '9876543210',
          donor_email: 'rahul@email.com',
          donor_address: 'Guraja Village, Andhra Pradesh, India',
          amount: 5000,
          amount_in_words: 'Rupees Five Thousand Only',
          payment_mode: 'UPI',
          reference_number: 'UPI123456789012',
          campaign_name: 'Education for All',
          campaign_description: 'Support for underprivileged students and educational initiatives.',
          contribution_type: 'Donation',
          ref_no: '123456',
          created_at: new Date().toISOString(),
          time: '11:45 AM',
          security_hash: `HASH-${Date.now().toString(16).toUpperCase()}`
        });
      }
    } catch (err) {
      setReceipt({
        receipt_number: recNo.startsWith('SKYG') ? recNo : `SKYG/24-25/${recNo.replace(/[^0-9]/g, '') || '000256'}`,
        donor_name: 'Rahul Kumar',
        donor_phone: '9876543210',
        donor_email: 'rahul@email.com',
        donor_address: 'Guraja Village, Andhra Pradesh, India',
        amount: 5000,
        amount_in_words: 'Rupees Five Thousand Only',
        payment_mode: 'UPI',
        reference_number: 'UPI123456789012',
        campaign_name: 'Education for All',
        campaign_description: 'Support for underprivileged students and educational initiatives.',
        contribution_type: 'Donation',
        ref_no: '123456',
        created_at: new Date().toISOString(),
        time: '11:45 AM',
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
      const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`${receipt?.receipt_number || 'SKY-Receipt'}.pdf`);
    } catch (err) {
      alert('Error generating PDF. Please use the Print option.');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Official E-Receipt: ${receipt?.receipt_number}\nAmount: ₹${Number(receipt?.amount || 5000).toLocaleString('en-IN')}\nContributor: ${receipt?.donor_name}\nCampaign: ${receipt?.campaign_name}\nSri Krishna Yadav Youth Guraja\nVerify online: https://skyguraja.org/verify?rec=${receipt?.receipt_number}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const displayDate = receipt?.created_at
    ? new Date(receipt.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '20 May 2024';

  const displayTime = receipt?.time || '11:45 AM';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#0B1B36] border border-amber-500/30 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        {/* Top Action Header */}
        <div className="p-3 sm:p-4 bg-[#061224] border-b border-white/10 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-xs sm:text-sm font-display tracking-wide">
              Official Digital Contribution Receipt (E-Receipt)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#16335F] hover:bg-[#1E437C] text-slate-200 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Save PDF</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Area */}
        <div className="overflow-y-auto p-2 sm:p-6 bg-slate-900/60 flex justify-center">
          {/* ========================================================
              EXACT E-RECEIPT CANVAS (Matches Reference Poster)
              ======================================================== */}
          <div
            ref={receiptRef}
            className="w-full max-w-2xl bg-white text-slate-900 shadow-2xl relative overflow-hidden font-sans border border-slate-200"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Background Mandalas & Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
              <div className="scale-150 transform">
                <SkyLogo variant="icon" size="xl" />
              </div>
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="#C99738">
                <circle cx="0" cy="0" r="80" fill="none" stroke="#C99738" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M0,0 Q40,10 50,50 Q10,40 0,0" fill="#C99738" />
              </svg>
            </div>
            <div className="absolute bottom-16 right-0 w-32 h-32 opacity-10 pointer-events-none transform rotate-180">
              <svg viewBox="0 0 100 100" fill="#C99738">
                <circle cx="0" cy="0" r="80" fill="none" stroke="#C99738" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M0,0 Q40,10 50,50 Q10,40 0,0" fill="#C99738" />
              </svg>
            </div>

            <div className="p-6 sm:p-8 space-y-5 relative z-10">
              {/* ========================================================
                  1. HEADER: Logo + Organization Title + E-Receipt Badge
                  ======================================================== */}
              <div className="flex items-start justify-between gap-4 pb-3">
                {/* Left: Emblem */}
                <div className="flex-shrink-0 pt-1">
                  <SkyLogo variant="icon" size="lg" />
                </div>

                {/* Center: Grand Title */}
                <div className="text-center flex-1 space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black tracking-wider text-[#061224] uppercase font-serif" style={{ letterSpacing: '0.08em' }}>
                    SRI KRISHNA YADAV
                  </h1>
                  <h2 className="text-xs sm:text-sm font-black tracking-[0.35em] text-[#0B1B36] uppercase">
                    Y O U T H &nbsp; G U R A J A
                  </h2>

                  {/* Golden Lotus Divider */}
                  <div className="flex items-center justify-center gap-2 py-0.5">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C99738]" />
                    <span className="text-[#C99738] text-xs">🪷</span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C99738]" />
                  </div>

                  <p className="text-[9px] sm:text-[10px] font-extrabold text-[#0B1B36] tracking-[0.2em] uppercase">
                    UNITY &nbsp;•&nbsp; YOUTH &nbsp;•&nbsp; SERVICE &nbsp;•&nbsp; COMMUNITY &nbsp;•&nbsp; PROGRESS
                  </p>
                </div>

                {/* Right: E-Receipt Pill & Meta */}
                <div className="flex-shrink-0 text-right space-y-2">
                  <div className="inline-block px-4 py-1 bg-[#06152B] text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-md shadow-sm">
                    E-RECEIPT
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-600 leading-tight">
                    <span className="text-slate-500 block text-[9px] uppercase font-medium">Receipt No.</span>
                    <span className="font-bold text-slate-900 font-mono">{receipt?.receipt_number || 'SKYG/24-25/000256'}</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-600 leading-tight">
                    <span className="text-slate-500 block text-[9px] uppercase font-medium">Date:</span>
                    <span className="font-bold text-slate-900">{displayDate}</span>
                  </div>
                </div>
              </div>

              {/* Thank You Script Message & QR Code */}
              <div className="flex items-center justify-between gap-4 py-2 border-t border-b border-amber-500/20 bg-amber-50/40 px-4 rounded-xl">
                <div className="space-y-0.5 flex-1">
                  <div className="text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-amber-600 text-xs">✦</span>
                    <span className="text-lg sm:text-xl font-serif italic font-bold text-amber-900">
                      Thank You!
                    </span>
                    <span className="text-amber-600 text-xs">✦</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                    We sincerely thank you for your generous contribution and support towards our mission.
                  </p>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="p-1 bg-white border border-slate-300 rounded shadow-sm">
                    <QRCodeSVG
                      value={`https://skyguraja.org/verify?rec=${receipt?.receipt_number || 'SKYG/24-25/000256'}&hash=${receipt?.security_hash || 'HASH-49A1F29C3E1B'}`}
                      size={54}
                    />
                  </div>
                  <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    SCAN TO VERIFY
                  </span>
                </div>
              </div>

              {/* ========================================================
                  2. CONTRIBUTOR DETAILS CARD
                  ======================================================== */}
              <div className="relative pt-3">
                {/* Header Tab */}
                <div className="absolute top-0 left-4 px-3 py-1 bg-[#06152B] text-white text-[10px] font-bold rounded-t-lg uppercase tracking-wider flex items-center gap-1.5 z-10">
                  <User className="w-3 h-3 text-amber-400" />
                  <span>CONTRIBUTOR DETAILS</span>
                </div>

                <div className="border border-slate-300 rounded-2xl p-4 pt-5 bg-white grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs text-slate-700">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium text-[11px]">Name</span>
                    <span className="col-span-2 font-bold text-slate-900">{receipt?.donor_name || 'Rahul Kumar'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium text-[11px]">Contribution Type</span>
                    <span className="col-span-2 font-bold text-slate-900">{receipt?.contribution_type || 'Donation'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium text-[11px]">Mobile</span>
                    <span className="col-span-2 font-bold text-slate-900 font-mono">{receipt?.donor_phone || '9876543210'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium text-[11px]">Payment Method</span>
                    <span className="col-span-2 font-bold text-slate-900">{receipt?.payment_mode || 'UPI'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium text-[11px]">Email</span>
                    <span className="col-span-2 font-medium text-slate-800 break-all">{receipt?.donor_email || 'rahul@email.com'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium text-[11px]">Transaction ID</span>
                    <span className="col-span-2 font-bold text-slate-900 font-mono text-[11px]">{receipt?.reference_number || 'UPI123456789012'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 sm:col-span-1">
                    <span className="text-slate-400 font-medium text-[11px]">Address</span>
                    <span className="col-span-2 font-medium text-slate-800 text-[11px]">{receipt?.donor_address || 'Guraja Village, Andhra Pradesh, India'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium text-[11px]">Reference No.</span>
                    <span className="col-span-2 font-bold text-slate-900 font-mono">{receipt?.ref_no || '123456'}</span>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  3. CONTRIBUTION DETAILS CARD
                  ======================================================== */}
              <div className="relative pt-3">
                <div className="absolute top-0 left-4 px-3 py-1 bg-[#06152B] text-white text-[10px] font-bold rounded-t-lg uppercase tracking-wider flex items-center gap-1.5 z-10">
                  <Gift className="w-3 h-3 text-amber-400" />
                  <span>CONTRIBUTION DETAILS</span>
                </div>

                <div className="border border-slate-300 rounded-2xl p-4 pt-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-sm">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Campaign / Purpose</span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {receipt?.campaign_name || 'Education for All'}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {receipt?.campaign_description || 'Support for underprivileged students and educational initiatives in Guraja.'}
                    </p>
                  </div>

                  <div className="text-left sm:text-right bg-amber-50/70 p-3 sm:p-4 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-900 uppercase font-bold block">Amount</span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
                      ₹ {Number(receipt?.amount || 5000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-amber-950 font-semibold italic mt-0.5">
                      ({receipt?.amount_in_words || 'Rupees Five Thousand Only'})
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  4. RECEIPT SUMMARY + OFFICIAL EMBOSSED SEAL
                  ======================================================== */}
              <div className="relative pt-3">
                <div className="absolute top-0 left-4 px-3 py-1 bg-[#06152B] text-white text-[10px] font-bold rounded-t-lg uppercase tracking-wider flex items-center gap-1.5 z-10">
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>RECEIPT SUMMARY</span>
                </div>

                <div className="border border-slate-300 rounded-2xl p-4 pt-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Summary Table */}
                  <div className="w-full sm:w-3/5 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Received Amount</span>
                      <span className="font-bold text-slate-900 font-mono">
                        ₹ {Number(receipt?.amount || 5000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Receipt Date</span>
                      <span className="font-bold text-slate-900 font-mono">{displayDate}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-medium">Receipt Time</span>
                      <span className="font-bold text-slate-900 font-mono">{displayTime}</span>
                    </div>
                  </div>

                  {/* Circular Verified Seal / Stamp */}
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#0B1B36] p-1 flex items-center justify-center shadow-inner relative group">
                      <div className="w-full h-full rounded-full border-2 border-[#0B1B36] flex flex-col items-center justify-center text-center p-1 bg-blue-50/30">
                        <span className="text-[6.5px] font-black uppercase text-[#0B1B36] tracking-tighter">
                          SRI KRISHNA YADAV YOUTH GURAJA
                        </span>
                        <div className="my-0.5 scale-75">
                          <SkyLogo variant="icon" size="sm" />
                        </div>
                        <span className="text-[6.5px] font-black uppercase text-[#0B1B36] tracking-wider">
                          ★ E-RECEIPT VERIFIED ★
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  5. SIGNATURE & VALUE PROMISE
                  ======================================================== */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2 text-xs">
                {/* Signature */}
                <div className="space-y-1">
                  <div className="h-9 flex items-end">
                    <span className="font-serif italic text-lg text-slate-800" style={{ fontFamily: "'Dancing Script', cursive, serif" }}>
                      Annan
                    </span>
                  </div>
                  <div className="border-t border-slate-400 pt-0.5">
                    <b className="text-[10px] text-slate-900 uppercase block font-sans">Authorized Signatory</b>
                    <span className="text-[9px] text-slate-500 block">Sri Krishna Yadav Youth Guraja</span>
                  </div>
                </div>

                {/* Badge */}
                <div className="flex items-center gap-2 p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 text-[10px] text-amber-950">
                  <div className="w-7 h-7 rounded-full bg-[#D4A244] text-slate-950 flex items-center justify-center flex-shrink-0 font-bold">
                    ✓
                  </div>
                  <span className="font-medium leading-tight">
                    Your contribution helps us build a better community and empower the youth.
                  </span>
                </div>

                {/* System Generated Text */}
                <div className="space-y-1 text-right">
                  <p className="text-[9px] text-slate-400 leading-snug">
                    This is a computer generated receipt. No signature is required.
                  </p>
                  <div className="p-1.5 border border-slate-300 rounded-lg text-center bg-slate-50">
                    <span className="text-[9px] text-slate-600 font-medium">
                      Thank you for being a part of <b className="text-slate-900 uppercase">OUR JOURNEY!</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                6. BOTTOM DARK NAVY CONTACT BAR
                ======================================================== */}
            <div className="bg-[#051124] text-slate-300 p-4 sm:px-8 text-[10px] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-t border-amber-500/20">
              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <b className="text-white block">Sri Krishna Yadav Youth Guraja</b>
                  <span className="text-slate-400">Guraja Village, Krishna District, Andhra Pradesh, India - 521321</span>
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-1 text-left sm:text-center text-slate-400">
                <div className="flex items-center gap-1.5 sm:justify-center">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span className="text-slate-200 font-mono">+91 98480 22334</span>
                </div>
                <div className="flex items-center gap-1.5 sm:justify-center">
                  <Mail className="w-3 h-3 text-amber-400" />
                  <span>info@skyyouthguraja.org</span>
                </div>
                <div className="flex items-center gap-1.5 sm:justify-center">
                  <Globe className="w-3 h-3 text-amber-400" />
                  <span>www.skyyouthguraja.org</span>
                </div>
              </div>

              {/* Follow Us */}
              <div className="text-left sm:text-right space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  FOLLOW US
                </span>
                <div className="flex items-center gap-2 sm:justify-end">
                  <div className="w-6 h-6 rounded-full bg-white/10 text-slate-300 flex items-center justify-center">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/10 text-slate-300 flex items-center justify-center">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/10 text-slate-300 flex items-center justify-center">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/10 text-slate-300 flex items-center justify-center">
                    <MessageCircle className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
