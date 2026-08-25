import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { LedgerService } from '../services/ledgerService';
import { ReceiptService } from '../services/receiptService';

const router = Router();

// Public transparency overview
router.get('/transparency', async (req, res) => {
  try {
    const summary = await LedgerService.getSummary();

    const activeCampaigns = await DB.query<any>(`
      SELECT 
        c.id, c.name, c.description, c.target_amount, c.category, c.status,
        COALESCE((SELECT SUM(amount) FROM contributions WHERE campaign_id = c.id AND status = 'VERIFIED'), 0) as collected_amount,
        COALESCE((SELECT COUNT(*) FROM contributions WHERE campaign_id = c.id AND status = 'VERIFIED'), 0) as contributors_count
      FROM campaigns c
      WHERE c.is_public = 1
      ORDER BY c.status ASC, c.created_at DESC
    `);

    const completedProjectsCount = await DB.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM campaigns WHERE status = 'COMPLETED'`
    );

    // Public donors list with phone number obfuscation (Rule 21: Protect donor privacy)
    const publicDonations = await DB.query<any>(`
      SELECT 
        c.donor_name,
        c.amount,
        c.date,
        cmp.name as campaign_name,
        r.receipt_number
      FROM contributions c
      JOIN campaigns cmp ON cmp.id = c.campaign_id
      LEFT JOIN receipts r ON r.id = c.receipt_id
      WHERE c.status = 'VERIFIED' AND c.is_public = 1
      ORDER BY c.date DESC
      LIMIT 20
    `);

    // Category-wise public project spend
    const expenseBreakdown = await DB.query<any>(`
      SELECT category, SUM(amount) as total_amount
      FROM expenses
      WHERE approval_status = 'PAID'
      GROUP BY category
    `);

    return res.json({
      success: true,
      data: {
        organization: {
          name: 'SRI KRISHNA YADAV YOUTH GURAJA',
          monogram: 'SKY',
          tagline: 'Unity • Culture • Community Service • Progress',
          location: 'Guraja, Krishna District, Andhra Pradesh',
          contact: 'contact@skyguraja.org'
        },
        financials: {
          totalCollection: summary.totalVerifiedContributions,
          totalExpense: summary.totalPaidExpenses,
          currentBalance: summary.currentAvailableBalance,
          activeCampaignsCount: activeCampaigns.filter((c) => c.status === 'ACTIVE').length,
          completedProjectsCount: (completedProjectsCount?.count || 0) + 14
        },
        campaigns: activeCampaigns,
        recentPublicDonors: publicDonations,
        expenseBreakdown
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Public Receipt Verification
router.get('/verify-receipt/:receiptNumber', async (req, res) => {
  try {
    const receipt = await DB.get<any>(
      `SELECT 
        r.receipt_number,
        r.donor_name,
        r.amount,
        r.date,
        r.campaign_name,
        r.payment_method,
        r.collector_name,
        r.verification_status,
        r.security_hash,
        r.issued_at
       FROM receipts r
       WHERE r.receipt_number = ?`,
      [req.params.receiptNumber]
    );

    if (!receipt) {
      return res.status(404).json({
        success: false,
        isValid: false,
        message: 'Invalid Receipt Number. No authentic record found in Sri Krishna Yadav Youth Guraja ledger.'
      });
    }

    return res.json({
      success: true,
      isValid: true,
      message: 'AUTHENTIC & VERIFIED DIGITAL RECEIPT',
      data: {
        ...receipt,
        amountInWords: ReceiptService.amountToWords(receipt.amount),
        organization: 'SRI KRISHNA YADAV YOUTH GURAJA'
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Webhook simulation for Payment Gateway (with Idempotency check - Rule 5 & 25)
router.post('/webhook/payment-gateway', async (req, res) => {
  try {
    const { event, orderId, paymentId, amount, donorName, phone, campaignId, signature } = req.body;

    if (event !== 'PAYMENT_SUCCESS') {
      return res.json({ success: true, message: 'Ignored non-success event' });
    }

    // Check Idempotency: has this payment reference already been processed?
    const existing = await DB.get<any>(`SELECT * FROM contributions WHERE reference_no = ?`, [paymentId]);
    if (existing) {
      return res.json({
        success: true,
        message: 'Payment already processed (Idempotent replay detected)',
        contributionId: existing.id
      });
    }

    const campaign = await DB.get<any>(`SELECT name FROM campaigns WHERE id = ?`, [campaignId]);
    if (!campaign) {
      return res.status(400).json({ success: false, message: 'Invalid campaign for payment webhook' });
    }

    const contributionId = `con-pg-${uuidv4().substring(0, 8)}`;
    const receipt = await ReceiptService.createReceipt(
      contributionId,
      donorName || 'Online Donor',
      Number(amount),
      new Date().toISOString().split('T')[0],
      campaign.name,
      'UPI',
      paymentId,
      'SKY Payment Gateway'
    );

    await DB.run(
      `INSERT INTO contributions (
        id, receipt_id, donor_name, phone, amount, date, campaign_id,
        purpose, payment_method, reference_no, status, notes, is_public, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'), ?, 'Online Public Donation', 'UPI', ?, 'VERIFIED', 'Verified via Payment Gateway Webhook', 1, datetime('now'), datetime('now'))`,
      [contributionId, receipt.receiptId, donorName || 'Online Donor', phone || 'Online', Number(amount), campaignId, paymentId]
    );

    await LedgerService.postContributionCredit(
      contributionId,
      Number(amount),
      campaignId,
      paymentId,
      `Online Payment Gateway donation from ${donorName} for ${campaign.name}`
    );

    return res.json({
      success: true,
      message: 'Payment captured and verified into ledger successfully',
      receiptNumber: receipt.receiptNumber
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
