import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Download,
  Printer,
  Share2,
  X,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  HeartHandshake,
  FileCheck
} from 'lucide-react';
import { RealReceipt } from '../services/receiptService';

interface ReceiptModalProps {
  receipt: RealReceipt | null;
  onClose: () => void;
  onNavigateToVerify?: (token: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receipt,
  onClose,
  onNavigateToVerify
}) => {
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!receipt) return null;

  const { contribution } = receipt;
  const verificationUrl = `${window.location.origin}/?verify=${receipt.verificationToken}`;

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`E-Receipt_${receipt.receiptNumber.replace(/[\/\\]/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `E-Receipt ${receipt.receiptNumber} - Sri Krishna Yadav Youth Guraja`,
          text: `Official E-Receipt for contribution of ₹${contribution.amount.toLocaleString('en-IN')} towards ${contribution.campaignTitle}.`,
          url: verificationUrl
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(verificationUrl);
      alert('Receipt verification link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container Dialog */}
      <div className="bg-[#040C18] border border-amber-500/30 rounded-3xl w-full max-w-3xl shadow-2xl p-4 sm:p-6 space-y-4 my-auto relative">
        {/* Action Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
              Official Verified E-Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#D4A244] to-[#B38020] hover:from-[#E5B869] text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#08152B] hover:bg-[#12274A] border border-white/15 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-[#08152B] hover:bg-[#12274A] border border-white/15 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            PIXEL-ACCURATE A4 E-RECEIPT CANVAS (EXACT MATCH TO REFERENCE IMAGE)
            ========================================================================= */}
        <div className="overflow-x-auto bg-slate-900/60 p-1 sm:p-3 rounded-2xl">
          <div
            ref={receiptRef}
            className="w-full min-w-[620px] max-w-[700px] mx-auto bg-[#FFFFFF] text-slate-900 p-8 sm:p-10 shadow-2xl relative select-none rounded-xl"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Subtle Watermark (Centered Transparent SKY Master Monogram) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] z-0 overflow-hidden">
              <img
                src="/images/sky_official_monogram.png"
                alt="Watermark"
                className="w-96 h-96 object-contain"
              />
            </div>

            <div className="relative z-10 space-y-6">
              {/* 1. TOP HEADER */}
              <div className="flex items-start justify-between border-b-2 border-[#D4A244]/40 pb-5">
                {/* Left: Official Master Monogram */}
                <div className="flex items-center gap-4">
                  <img
                    src="/images/sky_official_monogram.png"
                    alt="SKY Logo"
                    className="w-20 h-20 object-contain drop-shadow-md flex-shrink-0"
                  />
                  <div className="text-left">
                    <h1 className="font-serif font-black text-xl tracking-[0.1em] text-slate-900 uppercase leading-none">
                      SRI KRISHNA YADAV
                    </h1>
                    <h2 className="font-sans font-extrabold text-sm tracking-[0.3em] text-[#C49132] uppercase mt-1">
                      YOUTH GURAJA
                    </h2>
                    {/* Lotus Divider & Tagline */}
                    <div className="flex items-center gap-2 mt-1.5 text-[9px] font-bold text-slate-600 tracking-widest uppercase">
                      <span>❖</span>
                      <span>UNITY • YOUTH • SERVICE • COMMUNITY • PROGRESS</span>
                      <span>❖</span>
                    </div>
                  </div>
                </div>

                {/* Right: E-RECEIPT Badge, Receipt No, Date */}
                <div className="text-right flex flex-col items-end">
                  <div className="px-4 py-1.5 bg-[#051124] text-white rounded-lg text-xs font-black tracking-widest uppercase shadow-sm">
                    E-RECEIPT
                  </div>
                  <div className="mt-2 text-right space-y-0.5">
                    <div className="text-xs text-slate-500 font-semibold">Receipt No.</div>
                    <div className="text-sm font-black font-mono text-slate-900 tracking-tight">
                      {receipt.receiptNumber}
                    </div>
                    <div className="text-xs text-slate-700 font-medium">
                      Date: <span className="font-bold">{receipt.issueDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. THANK YOU BANNER & QR CODE */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="space-y-1">
                  <div className="text-[#C49132] font-serif font-bold text-2xl flex items-center gap-2">
                    <span>❧</span>
                    <span>Thank You!</span>
                    <span>☙</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium max-w-md">
                    We sincerely thank you for your generous contribution and support towards our mission and village community.
                  </p>
                </div>

                {/* Real Live QR Code */}
                <div
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => onNavigateToVerify && onNavigateToVerify(receipt.verificationToken)}
                  title="Click or Scan to Verify"
                >
                  <div className="p-1.5 bg-white border-2 border-[#D4A244]/60 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                    <QRCodeSVG value={verificationUrl} size={70} level="M" />
                  </div>
                  <span className="text-[8px] font-black tracking-widest text-[#051124] uppercase mt-1">
                    SCAN TO VERIFY
                  </span>
                </div>
              </div>

              {/* 3. CARD 1: CONTRIBUTOR DETAILS */}
              <div className="border border-[#D4A244]/40 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-[#051124] text-white px-4 py-1.5 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#D4A244]" />
                  <span>CONTRIBUTOR DETAILS</span>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4 text-xs">
                  {/* Left Column */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Name</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {contribution.contributorName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Mobile</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {contribution.phone}
                      </span>
                    </div>
                    {contribution.email && (
                      <div>
                        <span className="text-slate-400 text-[11px] block">Email</span>
                        <span className="text-slate-700">{contribution.email}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 text-[11px] block">Address</span>
                      <span className="text-slate-700">{contribution.address || 'Guraja Village, Andhra Pradesh, India'}</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2 pl-4 border-l border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Contribution Type</span>
                      <span className="font-bold text-slate-900">Donation / Seva</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Payment Method</span>
                      <span className="inline-block font-black px-2 py-0.5 rounded bg-amber-50 text-[#C49132] border border-[#D4A244]/40 font-mono text-[11px]">
                        {contribution.paymentMethod}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Transaction ID</span>
                      <span className="font-mono text-slate-800 font-semibold break-all text-[11px]">
                        {contribution.transactionId || 'TXN_VERIFIED'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Reference No.</span>
                      <span className="font-mono text-slate-700 text-[11px]">
                        {contribution.referenceNo || 'REF_OFFICIAL'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. CARD 2: CONTRIBUTION DETAILS */}
              <div className="border border-[#D4A244]/40 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-[#051124] text-white px-4 py-1.5 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#D4A244]" />
                  <span>CONTRIBUTION DETAILS</span>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px] block">Campaign / Purpose</span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {contribution.campaignTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Official youth committee seva fund and social development.
                    </p>
                  </div>

                  <div className="text-right bg-amber-50/50 p-3 rounded-xl border border-[#D4A244]/30">
                    <span className="text-slate-500 text-[11px] block font-semibold">Amount</span>
                    <div className="text-2xl font-black text-[#051124] font-mono">
                      ₹ {contribution.amount.toLocaleString('en-IN')}.00
                    </div>
                    <div className="text-[11px] text-[#C49132] font-semibold italic mt-0.5">
                      ({contribution.amountInWords})
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. CARD 3: RECEIPT SUMMARY & OFFICIAL CIRCULAR VERIFICATION STAMP */}
              <div className="grid grid-cols-2 gap-6 items-center pt-2">
                {/* Left: Summary Table */}
                <div className="border border-[#D4A244]/40 rounded-2xl overflow-hidden shadow-sm text-xs">
                  <div className="bg-[#051124] text-white px-3 py-1.5 font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#D4A244]" />
                    <span>RECEIPT SUMMARY</span>
                  </div>
                  <div className="p-3 space-y-1.5 divide-y divide-slate-100">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Received Amount</span>
                      <span className="font-bold text-slate-900 font-mono">
                        ₹ {contribution.amount.toLocaleString('en-IN')}.00
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Receipt Date</span>
                      <span className="font-semibold text-slate-800">{receipt.issueDate}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Receipt Time</span>
                      <span className="font-semibold text-slate-800">{receipt.issueTime}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Official Circular Stamp matching the reference image */}
                <div className="flex justify-center items-center">
                  <img
                    src="/images/sky_verified_stamp.png"
                    alt="Official Verification Stamp"
                    className="w-36 h-36 object-contain drop-shadow-md transform hover:rotate-6 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* 6. SIGNATORY & BADGES */}
              <div className="grid grid-cols-3 gap-4 items-center pt-3 border-t border-slate-200">
                {/* Left: Authorized Signatory */}
                <div className="space-y-1 text-left">
                  <div className="h-9 flex items-end">
                    <div className="font-serif italic font-bold text-slate-800 text-lg">
                      V. Krishna Yadav
                    </div>
                  </div>
                  <div className="border-t border-slate-400 w-32 pt-0.5" />
                  <div className="text-xs font-bold text-slate-900">Authorized Signatory</div>
                  <div className="text-[10px] text-slate-500">Sri Krishna Yadav Youth Guraja</div>
                </div>

                {/* Center: Gold Ribbon Badge */}
                <div className="flex items-center gap-2 bg-amber-50/70 border border-[#D4A244]/40 p-2.5 rounded-xl text-left">
                  <div className="w-7 h-7 rounded-full bg-[#D4A244] text-slate-950 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 fill-slate-950 text-white" />
                  </div>
                  <div className="text-[10px] text-slate-700 leading-tight">
                    Your contribution helps us build a better community and empower the youth.
                  </div>
                </div>

                {/* Right: Computer Generated Disclaimer */}
                <div className="border border-slate-200 bg-slate-50 p-2.5 rounded-xl text-right space-y-1">
                  <div className="text-[9px] text-slate-500 leading-tight">
                    This is a computer generated receipt. No signature is required.
                  </div>
                  <div className="text-[10px] font-black text-[#051124] uppercase tracking-wide">
                    OUR JOURNEY!
                  </div>
                </div>
              </div>

              {/* 7. FOOTER */}
              <div className="bg-[#051124] text-white p-3.5 rounded-xl grid grid-cols-3 gap-2 text-[10px] items-center">
                <div className="flex items-start gap-1.5 text-left">
                  <MapPin className="w-3.5 h-3.5 text-[#D4A244] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    Sri Krishna Yadav Youth Guraja, Guraja Village, AP - 521321
                  </span>
                </div>

                <div className="space-y-0.5 text-left pl-2">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Phone className="w-3 h-3 text-[#D4A244]" />
                    <span>+91 98480 11111</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Mail className="w-3 h-3 text-[#D4A244]" />
                    <span>info@skyouthguraja.org</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Globe className="w-3 h-3 text-[#D4A244]" />
                    <span>www.skyouthguraja.org</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-[9px] font-bold text-[#D4A244] tracking-wider uppercase">
                    FOLLOW US
                  </div>
                  <div className="flex items-center justify-end gap-2 text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">f</span>
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">ig</span>
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">yt</span>
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">wa</span>
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
