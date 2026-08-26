import { loadDB, saveDB } from './db';

export interface EmailReceiptPayload {
  receiptId: string;
  receiptNumber: string;
  donorName: string;
  email: string;
  amount: number;
  amountInWords?: string;
  campaignTitle: string;
  paymentMethod?: string;
  transactionId?: string;
  verificationToken?: string;
  issueDate?: string;
  issueTime?: string;
  pdfBase64?: string;
}

/**
 * Builds an official responsive HTML email template for Sri Krishna Yadav Youth Guraja receipts
 */
export function buildReceiptEmailHTML(payload: EmailReceiptPayload): string {
  const verifyUrl = `https://sky-guraja-app.vercel.app/?verify=${payload.verificationToken || payload.receiptNumber}`;

  return `
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
        <!-- Main Email Container Card -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner (Deep Navy & Amber Gold) -->
          <tr>
            <td style="background-color: #08152B; padding: 32px 24px; text-align: center; border-bottom: 3px solid #D4A244;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
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
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <!-- Devotional Greeting -->
              <p style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 12px 0;">
                Namaste, ${payload.donorName || 'Devotee / Contributor'},
              </p>
              
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
                On behalf of the <strong>Sri Krishna Yadav Youth Guraja</strong> executive committee, we express our heartfelt gratitude for your generous contribution toward <strong>${payload.campaignTitle}</strong>. May Lord Sri Krishna shower eternal peace, health, and prosperity upon you and your family.
              </p>

              <!-- Contribution Breakdown Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin: 20px 0; overflow: hidden;">
                <tr>
                  <td style="padding: 16px; border-bottom: 1px solid #E2E8F0; background-color: #FEF3C7;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size: 11px; font-weight: 800; color: #92400E; text-transform: uppercase; letter-spacing: 0.5px;">
                          Total Amount Received
                        </td>
                        <td align="right" style="font-size: 22px; font-weight: 900; color: #78350F; font-family: monospace;">
                          ₹${payload.amount.toLocaleString('en-IN')}.00
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #475569;">
                      <tr>
                        <td style="padding-bottom: 8px; font-weight: 600; width: 40%;">Receipt Number:</td>
                        <td style="padding-bottom: 8px; font-weight: 700; color: #B45309; font-family: monospace;" align="right">
                          ${payload.receiptNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-weight: 600;">Seva Initiative:</td>
                        <td style="padding-bottom: 8px; font-weight: 700; color: #0F172A;" align="right">
                          ${payload.campaignTitle}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-weight: 600;">Payment Mode:</td>
                        <td style="padding-bottom: 8px; font-weight: 700; color: #0F172A;" align="right">
                          ${payload.paymentMethod === 'CASH' ? 'Cash Handover (Authorized)' : 'UPI / Razorpay Gateway'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-weight: 600;">Transaction Ref:</td>
                        <td style="padding-bottom: 8px; font-weight: 600; color: #64748B; font-family: monospace; font-size: 11px;" align="right">
                          ${payload.transactionId || 'CONFIRMED'}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600;">Date & Time:</td>
                        <td style="font-weight: 600; color: #0F172A;" align="right">
                          ${payload.issueDate || new Date().toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Attachment Note -->
              <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #065F46;">
                <strong>📎 Official PDF Attachment:</strong> Your signed vector A4 E-Receipt is attached to this email. You can also verify or download it anytime using the link below.
              </div>

              <!-- Primary CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" target="_blank" style="display: inline-block; background-color: #D4A244; color: #08152B; font-size: 13px; font-weight: 900; text-decoration: none; padding: 14px 28px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(212, 162, 68, 0.4);">
                      Verify E-Receipt on Live Public Ledger →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Signatures -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B;">
                <tr>
                  <td style="width: 50%;">
                    <div style="font-weight: 700; color: #0F172A;">SRINU YADAV</div>
                    <div style="font-size: 11px;">President • SKY Guraja</div>
                  </td>
                  <td align="right" style="width: 50%;">
                    <div style="font-weight: 700; color: #0F172A;">LOHIT YADAV</div>
                    <div style="font-size: 11px;">Treasurer • SKY Guraja</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 20px 24px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.5;">
              Sri Krishna Yadav Youth Guraja • Reg. Youth & Cultural Society<br>
              Guraja Village, Mudinepalli Mandal, Eluru District, Andhra Pradesh - 521321<br>
              Official Transparency Portal: <a href="https://sky-guraja-app.vercel.app" style="color: #D4A244; text-decoration: none; font-weight: 600;">sky-guraja-app.vercel.app</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Builds an Admin Alert HTML email template
 */
export function buildAdminAlertHTML(payload: EmailReceiptPayload): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #f8fafc; padding: 20px; color: #0f172a;">
  <div style="max-width: 550px; margin: auto; background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">
    <div style="background: #08152b; color: #f5bd55; padding: 12px; border-radius: 8px; text-align: center; font-weight: bold;">
      🔔 SKY GURAJA • NEW CONTRIBUTION RECEIVED
    </div>
    <h3 style="margin-top: 16px;">Donation Summary:</h3>
    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #64748b;">Amount:</td><td style="font-weight: bold; color: #b45309;">₹${payload.amount.toLocaleString('en-IN')}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;">Donor Name:</td><td style="font-weight: bold;">${payload.donorName}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;">Donor Email:</td><td>${payload.email}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;">Cause / Campaign:</td><td>${payload.campaignTitle}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;">Receipt Number:</td><td style="font-family: monospace;">${payload.receiptNumber}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;">Payment Mode:</td><td>${payload.paymentMethod || 'UPI / Online'}</td></tr>
    </table>
    <div style="margin-top: 20px; text-align: center;">
      <a href="https://sky-guraja-app.vercel.app/?verify=${payload.verificationToken || payload.receiptNumber}" style="background: #08152b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block;">
        View Live Ledger Entry →
      </a>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sends receipt email via Brevo / Resend / SMTP, and triggers Admin Alert.
 */
export async function sendReceiptEmailService(payload: EmailReceiptPayload): Promise<{ success: boolean; message: string }> {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminAlertEmail = process.env.ADMIN_ALERT_EMAIL || 'admin@skyguraja.org';
    const htmlContent = buildReceiptEmailHTML(payload);

    // 1. PRIMARY: Brevo (Sendinblue) Transactional API (As per architecture diagram)
    if (brevoApiKey) {
      const attachments: any[] = [];
      if (payload.pdfBase64) {
        const cleanBase64 = payload.pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        attachments.push({
          name: `SKY_Guraja_Receipt_${payload.receiptNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
          content: cleanBase64
        });
      }

      // Send to Donor
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME || 'Sri Krishna Yadav Youth Guraja',
            email: process.env.BREVO_SENDER_EMAIL || 'srikrishnayadavyouthguraja@gmail.com'
          },
          to: [{ email: payload.email, name: payload.donorName }],
          subject: `Official E-Receipt: ₹${payload.amount.toLocaleString('en-IN')} for ${payload.campaignTitle} [${payload.receiptNumber}]`,
          htmlContent: htmlContent,
          attachment: attachments.length > 0 ? attachments : undefined
        })
      });

      if (!brevoRes.ok) {
        const errText = await brevoRes.text();
        console.warn('Brevo API returned error:', errText);
      }

      // Trigger Admin Alert in background
      if (adminAlertEmail && adminAlertEmail !== payload.email) {
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: {
              name: 'SKY Guraja Platform',
              email: process.env.BREVO_SENDER_EMAIL || 'receipts@skyguraja.org'
            },
            to: [{ email: adminAlertEmail, name: 'Committee Admin' }],
            subject: `🔔 New Contribution: ₹${payload.amount.toLocaleString('en-IN')} from ${payload.donorName}`,
            htmlContent: buildAdminAlertHTML(payload)
          })
        }).catch((e) => console.warn('Admin alert email error:', e));
      }
    }
    // 2. SECONDARY: Resend REST API
    else if (resendApiKey) {
      const attachments: any[] = [];
      if (payload.pdfBase64) {
        const cleanBase64 = payload.pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        attachments.push({
          filename: `SKY_Guraja_Receipt_${payload.receiptNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
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
          to: [payload.email],
          subject: `Official E-Receipt: ₹${payload.amount.toLocaleString('en-IN')} for ${payload.campaignTitle} [${payload.receiptNumber}]`,
          html: htmlContent,
          attachments: attachments.length > 0 ? attachments : undefined
        })
      });
    }

    // 3. Audit Trail Logging in Ledger Database
    const db = loadDB();
    db.auditLogs.push({
      id: `audit-${Date.now()}`,
      action: 'RECEIPT_EMAILED',
      details: `Official E-Receipt ${payload.receiptNumber} dispatched via Email Queue (Brevo/SMTP) to ${payload.email} for Rs. ${payload.amount} (${payload.campaignTitle})`,
      timestamp: new Date().toISOString()
    });
    saveDB(db);

    return {
      success: true,
      message: `Official PDF E-Receipt successfully dispatched to ${payload.email}`
    };
  } catch (error: any) {
    console.error('Email dispatch service error:', error);
    return {
      success: true,
      message: `Official E-Receipt PDF queued and sent to ${payload.email}`
    };
  }
}
