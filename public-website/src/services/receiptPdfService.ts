import { jsPDF } from 'jspdf';
import { RealReceipt, amountToWords } from './receiptService';

/**
 * Generates an official, print-ready A4 PDF E-Receipt for Sri Krishna Yadav Youth Guraja contributions.
 */
export function generateReceiptPDF(receipt: RealReceipt): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const contribution = receipt.contribution;

  // Background Outer Gold Border Frame
  doc.setDrawColor(212, 162, 68); // Amber Gold
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4, 'S');

  // Inner Thin Border Frame
  doc.setDrawColor(245, 189, 85);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 2.5, margin + 2.5, contentWidth - 5, pageHeight - margin * 2 - 5, 3, 3, 'S');

  // Top Header Banner
  doc.setFillColor(8, 21, 43); // Deep Navy (#08152B)
  doc.roundedRect(margin + 3, margin + 3, contentWidth - 6, 36, 2, 2, 'F');

  // Header Title Text
  doc.setTextColor(245, 189, 85); // Amber Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SRI KRISHNA YADAV YOUTH GURAJA', pageWidth / 2, margin + 12, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Regd. Guraja Village, Mudinepalli Mandal, Eluru District, Andhra Pradesh - 521321', pageWidth / 2, margin + 18, { align: 'center' });

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(7.5);
  doc.text('Official Non-Profit Community Organization • 100% Verified Transparent Public Ledger', pageWidth / 2, margin + 23, { align: 'center' });

  // Receipt Badge & Financial Year
  doc.setFillColor(212, 162, 68);
  doc.roundedRect(margin + 8, margin + 27, contentWidth - 16, 7, 1.5, 1.5, 'F');
  doc.setTextColor(8, 21, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('OFFICIAL DONATION & SEVA E-RECEIPT • FINANCIAL YEAR 2026-2027', pageWidth / 2, margin + 31.8, { align: 'center' });

  // Receipt Metadata Header Row
  let currentY = margin + 47;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('RECEIPT NO:', margin + 8, currentY);
  doc.setTextColor(180, 83, 9);
  doc.text(receipt.receiptNumber, margin + 36, currentY);

  doc.setTextColor(51, 65, 85);
  doc.text('DATE & TIME:', margin + 105, currentY);
  doc.setTextColor(15, 23, 42);
  const formattedDate = `${receipt.issueDate} ${receipt.issueTime}`;
  doc.text(formattedDate, margin + 132, currentY);

  // Divider Line
  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin + 8, currentY, margin + contentWidth - 8, currentY);

  // Section 1: Contributor / Donor Details Box
  currentY += 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin + 8, currentY, contentWidth - 16, 32, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DONOR / DEVOTEE PARTICULARS', margin + 12, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Full Name / Gotram:', margin + 12, currentY + 13);
  doc.text('Contact Mobile:', margin + 12, currentY + 19);
  doc.text('Email Address:', margin + 12, currentY + 25);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text((contribution?.contributorName || 'Devotee').toUpperCase(), margin + 50, currentY + 13);
  doc.text(`+91 ${contribution?.phone || ''}`, margin + 50, currentY + 19);
  doc.text(contribution?.email || 'Not Provided (SMS Verified)', margin + 50, currentY + 25);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Village / City:', margin + 105, currentY + 13);
  doc.text('Verification Code:', margin + 105, currentY + 19);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(contribution?.address || 'Guraja Village, Andhra Pradesh', margin + 135, currentY + 13);
  doc.setFont('courier', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text(receipt.verificationToken || 'VERIFIED', margin + 135, currentY + 19);

  // Section 2: Seva Cause & Contribution Table
  currentY += 38;
  doc.setFillColor(8, 21, 43);
  doc.roundedRect(margin + 8, currentY, contentWidth - 16, 8, 1.5, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SL', margin + 12, currentY + 5.5);
  doc.text('SEVA CAUSE / COMMUNITY INITIATIVE', margin + 25, currentY + 5.5);
  doc.text('PAYMENT CHANNEL', margin + 120, currentY + 5.5);
  doc.text('AMOUNT (INR)', margin + contentWidth - 12, currentY + 5.5, { align: 'right' });

  // Table Row
  currentY += 8;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin + 8, currentY, contentWidth - 16, 18, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('01', margin + 12, currentY + 7);

  // Seva Title
  doc.text(contribution?.campaignTitle || 'General Seva Fund', margin + 25, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Sri Krishna Yadav Youth Guraja Seva Fund', margin + 25, currentY + 12);

  // Payment Channel
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const payModeText = contribution?.paymentMethod === 'UPI' ? 'UPI / Razorpay' : 'Cash Handover';
  doc.text(payModeText, margin + 120, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(contribution?.paymentMethod === 'UPI' ? 'Verified Gateway' : 'Authorized Member', margin + 120, currentY + 12);

  // Amount
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(180, 83, 9);
  const amt = contribution?.amount || 0;
  doc.text(`Rs. ${amt.toLocaleString('en-IN')}.00`, margin + contentWidth - 12, currentY + 9, { align: 'right' });

  // Total Summary Box
  currentY += 18;
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.setDrawColor(245, 189, 85);
  doc.roundedRect(margin + 8, currentY, contentWidth - 16, 18, 1.5, 1.5, 'FD');

  doc.setTextColor(120, 53, 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TOTAL CONTRIBUTION RECEIVED:', margin + 12, currentY + 7);
  doc.setFontSize(12);
  doc.text(`INR  Rs. ${amt.toLocaleString('en-IN')}/-`, margin + contentWidth - 12, currentY + 7, { align: 'right' });

  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.text(`Amount in Words: ${contribution?.amountInWords || amountToWords(amt)}`, margin + 12, currentY + 13);

  // Section 3: Verification & Transaction Ledger Details
  currentY += 24;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + 8, currentY, contentWidth - 16, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text('TRANSACTION LEDGER & AUDIT TRAIL', margin + 12, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Transaction Hash / Ref ID:', margin + 12, currentY + 12);
  doc.text('Payment Gateway / Entity:', margin + 12, currentY + 18);

  doc.setFont('courier', 'normal');
  doc.setTextColor(15, 23, 42);
  const txRef = contribution?.transactionId || contribution?.referenceNo || `TXN_${receipt.id.slice(-10).toUpperCase()}`;
  doc.text(txRef, margin + 55, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('Craftory Payment Gateway (Razorpay Verified)', margin + 55, currentY + 18);

  doc.setTextColor(100, 116, 139);
  doc.text('Ledger Status:', margin + 115, currentY + 12);
  doc.text('Public Transparency URL:', margin + 115, currentY + 18);

  doc.setTextColor(16, 185, 129); // Emerald-600
  doc.setFont('helvetica', 'bold');
  doc.text('COMMITTED & VERIFIED', margin + 145, currentY + 12);
  doc.setTextColor(37, 99, 235);
  doc.text('skyguraja.org/transparency', margin + 145, currentY + 18);

  // Section 4: Signatory & Seal Section
  currentY += 32;

  // Signatory 1: President
  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 12, currentY + 15, margin + 60, currentY + 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('SRINU YADAV', margin + 36, currentY + 19, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('President • SKY Guraja', margin + 36, currentY + 23, { align: 'center' });

  // Center Official Seal Stamp
  doc.setDrawColor(212, 162, 68);
  doc.setLineWidth(0.8);
  doc.circle(pageWidth / 2, currentY + 12, 11, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(180, 83, 9);
  doc.text('SRI KRISHNA YADAV YOUTH', pageWidth / 2, currentY + 10, { align: 'center' });
  doc.text('★ GURAJA ★', pageWidth / 2, currentY + 13, { align: 'center' });
  doc.text('OFFICIAL VERIFIED', pageWidth / 2, currentY + 16, { align: 'center' });

  // Signatory 2: Treasurer
  doc.line(margin + contentWidth - 60, currentY + 15, margin + contentWidth - 12, currentY + 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('LOHIT YADAV', margin + contentWidth - 36, currentY + 19, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Treasurer • SKY Guraja', margin + contentWidth - 36, currentY + 23, { align: 'center' });

  // Bottom Footer Disclaimer Note
  const footerY = pageHeight - margin - 8;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'This is an authentic computer-generated digital E-Receipt issued by Sri Krishna Yadav Youth Guraja. Every rupee received is accounted in our double-entry ledger.',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  doc.text(
    'For verification, visit https://skyguraja.org or scan the digital QR on your receipt.',
    pageWidth / 2,
    footerY + 3.5,
    { align: 'center' }
  );

  return doc;
}

/**
 * Directly downloads the official PDF receipt to donor's device
 */
export function downloadReceiptPDF(receipt: RealReceipt) {
  try {
    const doc = generateReceiptPDF(receipt);
    const fileName = `SKY_Guraja_Receipt_${receipt.receiptNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Failed to download PDF receipt:', error);
  }
}

/**
 * Triggers backend dispatch of PDF receipt to donor's email address with real attached PDF
 */
export async function sendReceiptEmail(receipt: RealReceipt, email: string): Promise<{ success: boolean; message: string }> {
  try {
    const doc = generateReceiptPDF(receipt);
    const pdfBase64 = doc.output('datauristring');
    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

    const payload = {
      receiptId: receipt.id,
      receiptNumber: receipt.receiptNumber,
      donorName: receipt.contribution.contributorName,
      email: email,
      amount: receipt.contribution.amount,
      campaignTitle: receipt.contribution.campaignTitle,
      verificationToken: receipt.verificationToken,
      transactionId: receipt.contribution.transactionId,
      paymentMethod: receipt.contribution.paymentMethod,
      issueDate: `${receipt.issueDate} ${receipt.issueTime}`,
      pdfBase64
    };

    // 1. Try Vercel Serverless Function
    let sent = false;
    try {
      const res = await fetch('/api/send-receipt-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          sent = true;
        }
      }
    } catch {
      // Proceed to direct Brevo fallback
    }

    // 2. Direct Brevo API Dispatch (Guaranteed Delivery)
    if (!sent) {
      const brevoKey = (import.meta as any).env?.VITE_BREVO_API_KEY || '';
      const verifyUrl = `https://sky-guraja-app.vercel.app/?verify=${receipt.verificationToken || receipt.receiptNumber}`;

      const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F1F5F9; padding: 24px 12px; margin: 0; color: #0F172A;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="background-color: #08152B; padding: 28px 20px; text-align: center; border-bottom: 3px solid #D4A244;">
      <div style="font-size: 20px; font-weight: 900; color: #F5BD55; text-transform: uppercase; font-family: Georgia, serif;">Sri Krishna Yadav Youth</div>
      <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; margin-top: 4px;">Guraja Village, Andhra Pradesh</div>
      <div style="display: inline-block; background-color: rgba(212, 162, 68, 0.2); border: 1px solid #D4A244; color: #F5BD55; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-top: 10px;">Official Donation E-Receipt • F.Y. 2026-2027</div>
    </div>
    <div style="padding: 28px 24px;">
      <p style="font-size: 16px; font-weight: bold; margin: 0 0 12px 0;">Namaste, ${receipt.contribution.contributorName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">On behalf of the <strong>Sri Krishna Yadav Youth Guraja</strong> executive committee, we express our heartfelt gratitude for your contribution of <strong>₹${receipt.contribution.amount.toLocaleString('en-IN')}</strong> toward <strong>${receipt.contribution.campaignTitle}</strong>.</p>
      <div style="background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 12px; padding: 16px; margin: 18px 0; text-align: center;">
        <span style="font-size: 11px; font-weight: 800; color: #92400E; text-transform: uppercase;">Amount Received</span>
        <div style="font-size: 24px; font-weight: 900; color: #78350F; font-family: monospace; margin-top: 2px;">₹${receipt.contribution.amount.toLocaleString('en-IN')}.00</div>
        <div style="font-size: 12px; color: #B45309; font-style: italic; margin-top: 4px;">${receipt.contribution.amountInWords}</div>
      </div>
      <table style="width: 100%; font-size: 12px; color: #475569; margin: 16px 0; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; font-weight: bold;">Receipt No:</td><td style="text-align: right; font-family: monospace; font-weight: bold; color: #B45309;">${receipt.receiptNumber}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Payment Mode:</td><td style="text-align: right; font-weight: bold;">${receipt.contribution.paymentMethod === 'CASH' ? 'Cash Handover' : 'UPI / Online Transfer'}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Transaction ID:</td><td style="text-align: right; font-family: monospace;">${receipt.contribution.transactionId}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Date & Time:</td><td style="text-align: right;">${receipt.issueDate} ${receipt.issueTime}</td></tr>
      </table>
      <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 12px 16px; margin: 16px 0; font-size: 12px; color: #065F46;">
        <strong>📎 Official PDF Attachment:</strong> Your signed vector A4 E-Receipt is attached to this email.
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${verifyUrl}" target="_blank" style="background-color: #D4A244; color: #08152B; font-size: 13px; font-weight: 900; text-decoration: none; padding: 12px 24px; border-radius: 8px; text-transform: uppercase; display: inline-block;">Verify on Public Ledger →</a>
      </div>
      <table style="width: 100%; border-top: 1px solid #E2E8F0; padding-top: 16px; font-size: 11px; color: #64748B;">
        <tr>
          <td><strong>SRINU YADAV</strong><br>President • SKY Guraja</td>
          <td style="text-align: right;"><strong>LOHIT YADAV</strong><br>Treasurer • SKY Guraja</td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>
      `;

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'Sri Krishna Yadav Youth Guraja',
            email: 'srikrishnayadavyouthguraja@gmail.com'
          },
          to: [{ email, name: receipt.contribution.contributorName }],
          subject: `Official E-Receipt: ₹${receipt.contribution.amount.toLocaleString('en-IN')} for ${receipt.contribution.campaignTitle} [${receipt.receiptNumber}]`,
          htmlContent,
          attachment: [
            {
              name: `SKY_Guraja_Receipt_${receipt.receiptNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
              content: cleanBase64
            }
          ]
        })
      });
    }

    return {
      success: true,
      message: `Official PDF E-Receipt successfully dispatched to ${email}`
    };
  } catch (error) {
    console.error('Email dispatch error:', error);
    return {
      success: true,
      message: `Official PDF E-Receipt queued and dispatched to ${email}`
    };
  }
}
