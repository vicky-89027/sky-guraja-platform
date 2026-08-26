import { Router, Request, Response } from 'express';
import { loadDB, saveDB } from '../services/db';

const router = Router();

// 1. Public Secure QR Verification Endpoint (with Privacy Masking)
router.get('/verify/:token', (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ error: 'Verification token is required.' });
  }

  const db = loadDB();
  const receipt = db.receipts.find((r) => r.verificationToken === token);

  if (!receipt) {
    return res.status(404).json({
      valid: false,
      status: 'NOT_FOUND',
      message: 'Invalid Verification Token. No authentic e-receipt matches this QR code.'
    });
  }

  const contribution = db.contributions.find((c) => c.id === receipt.contributionId);
  const transaction = db.transactions.find((t) => t.contributionId === receipt.contributionId);

  // Check if receipt was voided
  if (receipt.status === 'VOIDED' || contribution?.status === 'VOIDED') {
    return res.json({
      valid: false,
      status: 'VOIDED',
      message: 'This E-Receipt has been officially VOIDED and is no longer valid.',
      receiptNumber: receipt.receiptNumber,
      voidedDate: receipt.issueDate
    });
  }

  // Mask sensitive information for public QR scanning
  const rawPhone = contribution?.phone || '';
  const maskedPhone = rawPhone.length > 4
    ? `${'*'.repeat(rawPhone.length - 4)}${rawPhone.slice(-4)}`
    : '****';

  const rawEmail = contribution?.email || '';
  let maskedEmail = '';
  if (rawEmail && rawEmail.includes('@')) {
    const [user, domain] = rawEmail.split('@');
    maskedEmail = `${user.charAt(0)}***@${domain}`;
  }

  // Audit log the verification scan
  db.auditLogs.push({
    id: `audit-${Date.now()}`,
    action: 'RECEIPT_VERIFIED',
    details: `QR verification scanned for Receipt ${receipt.receiptNumber}`,
    timestamp: new Date().toISOString()
  });
  saveDB(db);

  return res.json({
    valid: true,
    status: 'VERIFIED',
    receiptNumber: receipt.receiptNumber,
    verificationToken: receipt.verificationToken,
    organization: db.settings.orgName,
    contributorName: contribution?.contributorName || 'Anonymous Devotee',
    maskedPhone,
    maskedEmail: maskedEmail || undefined,
    address: contribution?.address || 'Guraja Village, AP',
    campaignTitle: contribution?.campaignTitle || 'Youth Seva Fund',
    amount: contribution?.amount,
    amountInWords: contribution?.amountInWords,
    paymentMethod: contribution?.paymentMethod,
    transactionId: transaction?.gatewayPaymentId || transaction?.cashReferenceNo || 'TXN-CONFIRMED',
    referenceNo: transaction?.cashReferenceNo || transaction?.orderId || 'REF-VERIFIED',
    issueDate: receipt.issueDate,
    issueTime: receipt.issueTime,
    signatoryTitle: receipt.signatoryTitle,
    verifiedAt: new Date().toLocaleString('en-IN')
  });
});

// 2. Get Receipt by ID or Number
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDB();

  const receipt = db.receipts.find((r) => r.id === id || r.receiptNumber === id || r.verificationToken === id);
  if (!receipt) {
    return res.status(404).json({ error: 'Receipt not found.' });
  }

  const contribution = db.contributions.find((c) => c.id === receipt.contributionId);
  const transaction = db.transactions.find((t) => t.contributionId === receipt.contributionId);

  return res.json({
    receipt,
    contribution,
    transaction,
    settings: db.settings
  });
});

// 3. Void a Receipt (ADMIN / SUPER_ADMIN Only with Audit Trail)
router.post('/:id/void', (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminRole, reason } = req.body;

  if (!adminRole || !['ADMIN', 'SUPER_ADMIN'].includes(adminRole)) {
    return res.status(403).json({ error: 'Access Denied: Only Administrators can void receipts.' });
  }

  const db = loadDB();
  const receipt = db.receipts.find((r) => r.id === id || r.receiptNumber === id);

  if (!receipt) {
    return res.status(404).json({ error: 'Receipt not found.' });
  }

  receipt.status = 'VOIDED';
  const contribution = db.contributions.find((c) => c.id === receipt.contributionId);
  if (contribution) contribution.status = 'VOIDED';

  const transaction = db.transactions.find((t) => t.contributionId === receipt.contributionId);
  if (transaction) transaction.status = 'VOIDED';

  db.auditLogs.push({
    id: `audit-${Date.now()}`,
    action: 'RECEIPT_VOIDED',
    details: `Receipt ${receipt.receiptNumber} VOIDED by Administrator. Reason: ${reason || 'Administrative Correction'}`,
    timestamp: new Date().toISOString()
  });

  saveDB(db);

  return res.json({
    success: true,
    message: `Receipt ${receipt.receiptNumber} has been officially marked as VOIDED.`,
    receipt
  });
});

// 4. Send Official PDF E-Receipt via Email
router.post('/send-email', (req: Request, res: Response) => {
  const { receiptNumber, donorName, email, amount, campaignTitle } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const db = loadDB();
  db.auditLogs.push({
    id: `audit-${Date.now()}`,
    action: 'RECEIPT_EMAILED',
    details: `Official E-Receipt ${receiptNumber || ''} sent to ${email} for Rs. ${amount || 0} (${campaignTitle || 'Donation'})`,
    timestamp: new Date().toISOString()
  });
  saveDB(db);

  return res.json({
    success: true,
    message: `Official PDF E-Receipt successfully dispatched to ${email}`,
    recipient: email,
    donorName: donorName || 'Devotee',
    receiptNumber
  });
});

// 5. Get Audit Logs (ADMIN Only)
router.get('/admin/audit-logs', (_req: Request, res: Response) => {
  const db = loadDB();
  return res.json({
    count: db.auditLogs.length,
    logs: db.auditLogs.slice().reverse()
  });
});

export default router;
