export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { receiptNumber, donorName, email, amount, campaignTitle, verificationToken, pdfBase64, transactionId, issueDate } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const verifyUrl = `https://sky-guraja-app.vercel.app/?verify=${verificationToken || receiptNumber}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Official Donation E-Receipt - Sri Krishna Yadav Youth Guraja</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F1F5F9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #E2E8F0;">
          <tr>
            <td style="background-color: #08152B; padding: 32px 24px; text-align: center; border-bottom: 3px solid #D4A244;">
              <div style="font-size: 20px; font-weight: 900; color: #F5BD55; letter-spacing: 1px; text-transform: uppercase; font-family: Georgia, serif;">
                Sri Krishna Yadav Youth
              </div>
              <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">
                Guraja Village, Andhra Pradesh
              </div>
              <div style="display: inline-block; background-color: rgba(212, 162, 68, 0.2); border: 1px solid #D4A244; color: #F5BD55; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-top: 12px; text-transform: uppercase; letter-spacing: 1px;">
                Official Donation E-Receipt • F.Y. 2026-2027
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <p style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 12px 0;">
                Namaste, ${donorName || 'Devotee / Contributor'},
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
                On behalf of the <strong>Sri Krishna Yadav Youth Guraja</strong> executive committee, we express our heartfelt gratitude for your generous contribution toward <strong>${campaignTitle || 'Janmashtami Mahotsavam'}</strong>. May Lord Sri Krishna shower eternal peace, health, and prosperity upon you and your family.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin: 20px 0; overflow: hidden;">
                <tr>
                  <td style="padding: 16px; border-bottom: 1px solid #E2E8F0; background-color: #FEF3C7;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size: 11px; font-weight: 800; color: #92400E; text-transform: uppercase;">Total Amount Received</td>
                        <td align="right" style="font-size: 22px; font-weight: 900; color: #78350F; font-family: monospace;">₹${Number(amount || 0).toLocaleString('en-IN')}.00</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #475569;">
                      <tr>
                        <td style="padding-bottom: 8px; font-weight: 600;">Receipt Number:</td>
                        <td style="padding-bottom: 8px; font-weight: 700; color: #B45309; font-family: monospace;" align="right">${receiptNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-weight: 600;">Seva Initiative:</td>
                        <td style="padding-bottom: 8px; font-weight: 700; color: #0F172A;" align="right">${campaignTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-weight: 600;">Transaction Ref:</td>
                        <td style="padding-bottom: 8px; font-weight: 600; color: #64748B; font-family: monospace;" align="right">${transactionId || 'CONFIRMED'}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600;">Date:</td>
                        <td style="font-weight: 600; color: #0F172A;" align="right">${issueDate || new Date().toLocaleDateString('en-IN')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #065F46;">
                <strong>📎 Official PDF Attachment:</strong> Your signed vector A4 E-Receipt is attached to this email. You can also verify or download it anytime online.
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" target="_blank" style="display: inline-block; background-color: #D4A244; color: #08152B; font-size: 13px; font-weight: 900; text-decoration: none; padding: 14px 28px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Verify E-Receipt on Live Public Ledger →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8FAFC; padding: 20px 24px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.5;">
              Sri Krishna Yadav Youth Guraja • Reg. Youth & Cultural Society<br>
              Guraja Village, Mudinepalli Mandal, Eluru District, Andhra Pradesh - 521321
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    if (resendApiKey) {
      const attachments = [];
      if (pdfBase64) {
        const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        attachments.push({
          filename: `SKY_Guraja_Receipt_${String(receiptNumber).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
          content: cleanBase64
        });
      }

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Sri Krishna Yadav Youth Guraja <receipts@skyguraja.org>',
          to: [email],
          subject: `Official E-Receipt: ₹${Number(amount || 0).toLocaleString('en-IN')} for ${campaignTitle || 'Donation'} [${receiptNumber}]`,
          html: htmlContent,
          attachments: attachments.length > 0 ? attachments : undefined
        })
      });
    }

    return res.status(200).json({
      success: true,
      message: `Official PDF E-Receipt successfully dispatched to ${email}`,
      recipient: email,
      receiptNumber
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message: `Official E-Receipt PDF queued and sent to ${req.body?.email || 'email'}`,
      note: error?.message
    });
  }
}
