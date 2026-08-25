import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { authenticateToken, requireRoles, forbidAuditorMutation, AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/audit';
import { LedgerService } from '../services/ledgerService';
import { ReceiptService } from '../services/receiptService';

const router = Router();

// List all contributions with rich search, filters & pagination
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      search,
      campaignId,
      status,
      paymentMethod,
      collectedById,
      startDate,
      endDate,
      limit = 50,
      offset = 0
    } = req.query;

    let sql = `
      SELECT 
        c.*, 
        cmp.name as campaign_name,
        m.name as collector_name,
        r.receipt_number,
        u.full_name as verified_by_name
      FROM contributions c
      JOIN campaigns cmp ON cmp.id = c.campaign_id
      LEFT JOIN committee_members m ON m.id = c.collected_by_id
      LEFT JOIN receipts r ON r.id = c.receipt_id
      LEFT JOIN users u ON u.id = c.verified_by_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (c.donor_name LIKE ? OR c.phone LIKE ? OR c.reference_no LIKE ? OR r.receipt_number LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }
    if (campaignId) {
      sql += ` AND c.campaign_id = ?`;
      params.push(campaignId);
    }
    if (status) {
      sql += ` AND c.status = ?`;
      params.push(status);
    }
    if (paymentMethod) {
      sql += ` AND c.payment_method = ?`;
      params.push(paymentMethod);
    }
    if (collectedById) {
      sql += ` AND c.collected_by_id = ?`;
      params.push(collectedById);
    }
    if (startDate) {
      sql += ` AND c.date >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND c.date <= ?`;
      params.push(endDate);
    }

    sql += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const items = await DB.query<any>(sql, params);
    const totalRow = await DB.get<{ count: number }>(`SELECT COUNT(*) as count FROM contributions`);

    return res.json({
      success: true,
      data: items,
      total: totalRow?.count || 0
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get single contribution by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const item = await DB.get<any>(
      `SELECT c.*, cmp.name as campaign_name, m.name as collector_name, r.receipt_number, r.qr_code_data, r.security_hash
       FROM contributions c
       JOIN campaigns cmp ON cmp.id = c.campaign_id
       LEFT JOIN committee_members m ON m.id = c.collected_by_id
       LEFT JOIN receipts r ON r.id = c.receipt_id
       WHERE c.id = ?`,
      [req.params.id]
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Contribution not found' });
    }

    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Create new contribution (Volunteers, Members, Treasurers, Admins)
router.post('/', authenticateToken, forbidAuditorMutation, async (req: AuthRequest, res) => {
  try {
    const {
      donorName,
      phone,
      email,
      amount,
      date,
      campaignId,
      purpose,
      paymentMethod,
      referenceNo,
      notes,
      isPublic = true,
      autoVerify = false // If Treasurer or Super Admin adds and opts to auto-verify
    } = req.body;

    if (!donorName || !phone || !amount || !campaignId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Donor name, phone, amount, campaign, and payment method are required.'
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
    }

    // Check campaign validity
    const campaign = await DB.get<{ id: string; name: string }>(`SELECT id, name FROM campaigns WHERE id = ?`, [campaignId]);
    if (!campaign) {
      return res.status(400).json({ success: false, message: 'Invalid campaign selected.' });
    }

    const contributionId = `con-${uuidv4().substring(0, 8)}`;
    const collectorId = req.user?.memberId || null;
    const canAutoVerify = autoVerify && (req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'TREASURER');
    const initialStatus = canAutoVerify ? 'VERIFIED' : 'SUBMITTED';

    let receiptId: string | null = null;
    let receiptNumber: string | null = null;

    if (canAutoVerify) {
      // Create Receipt & Ledger Entry
      const collectorRow = collectorId
        ? await DB.get<{ name: string }>(`SELECT name FROM committee_members WHERE id = ?`, [collectorId])
        : null;
      const collectorName = collectorRow?.name || req.user?.fullName || 'Treasurer Office';

      const receipt = await ReceiptService.createReceipt(
        contributionId,
        donorName,
        numericAmount,
        date || new Date().toISOString().split('T')[0],
        campaign.name,
        paymentMethod,
        referenceNo,
        collectorName
      );

      receiptId = receipt.receiptId;
      receiptNumber = receipt.receiptNumber;

      // Insert contribution
      await DB.run(
        `INSERT INTO contributions (
          id, receipt_id, donor_name, phone, email, amount, date, campaign_id,
          purpose, payment_method, reference_no, collected_by_id, status,
          verified_by_id, verified_at, notes, is_public, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VERIFIED', ?, datetime('now'), ?, ?, datetime('now'), datetime('now'))`,
        [
          contributionId,
          receiptId,
          donorName,
          phone,
          email || null,
          numericAmount,
          date || new Date().toISOString().split('T')[0],
          campaignId,
          purpose || campaign.name,
          paymentMethod,
          referenceNo || null,
          collectorId,
          req.user?.id,
          notes || null,
          isPublic ? 1 : 0
        ]
      );

      // Post to ledger
      await LedgerService.postContributionCredit(
        contributionId,
        numericAmount,
        campaignId,
        referenceNo || receiptNumber,
        `Verified Contribution from ${donorName} for ${campaign.name}`,
        req.user
      );
    } else {
      // Standard submission
      await DB.run(
        `INSERT INTO contributions (
          id, donor_name, phone, email, amount, date, campaign_id,
          purpose, payment_method, reference_no, collected_by_id, status,
          notes, is_public, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', ?, ?, datetime('now'), datetime('now'))`,
        [
          contributionId,
          donorName,
          phone,
          email || null,
          numericAmount,
          date || new Date().toISOString().split('T')[0],
          campaignId,
          purpose || campaign.name,
          paymentMethod,
          referenceNo || null,
          collectorId,
          notes || null,
          isPublic ? 1 : 0
        ]
      );
    }

    await logAudit({
      user: req.user,
      action: canAutoVerify ? 'CREATE_AND_VERIFY_CONTRIBUTION' : 'SUBMIT_CONTRIBUTION',
      entityType: 'CONTRIBUTION',
      entityId: contributionId,
      newValue: {
        donorName,
        amount: numericAmount,
        campaign: campaign.name,
        paymentMethod,
        status: initialStatus,
        receiptNumber
      },
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: canAutoVerify
        ? `Contribution verified and receipt ${receiptNumber} generated!`
        : 'Contribution submitted successfully. Pending Treasurer verification.',
      data: {
        contributionId,
        receiptNumber,
        status: initialStatus
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Verify a pending contribution (Authorized: TREASURER, SUPER_ADMIN, PRESIDENT)
router.post('/:id/verify', authenticateToken, forbidAuditorMutation, requireRoles('TREASURER', 'SUPER_ADMIN', 'PRESIDENT'), async (req: AuthRequest, res) => {
  try {
    const contribution = await DB.get<any>(
      `SELECT c.*, cmp.name as campaign_name, m.name as collector_name
       FROM contributions c
       JOIN campaigns cmp ON cmp.id = c.campaign_id
       LEFT JOIN committee_members m ON m.id = c.collected_by_id
       WHERE c.id = ?`,
      [req.params.id]
    );

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found.' });
    }

    if (contribution.status === 'VERIFIED') {
      return res.status(400).json({ success: false, message: 'Contribution is already verified.' });
    }

    const collectorName = contribution.collector_name || req.user?.fullName || 'Treasurer Office';

    // 1. Generate Receipt
    const receipt = await ReceiptService.createReceipt(
      contribution.id,
      contribution.donor_name,
      contribution.amount,
      contribution.date,
      contribution.campaign_name,
      contribution.payment_method,
      contribution.reference_no,
      collectorName
    );

    // 2. Post to Ledger
    await LedgerService.postContributionCredit(
      contribution.id,
      contribution.amount,
      contribution.campaign_id,
      contribution.reference_no || receipt.receiptNumber,
      `Verified Contribution from ${contribution.donor_name} for ${contribution.campaign_name}`,
      req.user
    );

    // 3. Update Contribution Status & Receipt Link
    await DB.run(
      `UPDATE contributions 
       SET status = 'VERIFIED', receipt_id = ?, verified_by_id = ?, verified_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ?`,
      [receipt.receiptId, req.user?.id, contribution.id]
    );

    // 4. Update assignment quota if assigned
    if (contribution.collected_by_id) {
      await DB.run(
        `UPDATE collection_assignments 
         SET updated_at = datetime('now')
         WHERE campaign_id = ? AND member_id = ?`,
        [contribution.campaign_id, contribution.collected_by_id]
      );
    }

    await logAudit({
      user: req.user,
      action: 'VERIFY_CONTRIBUTION',
      entityType: 'CONTRIBUTION',
      entityId: contribution.id,
      previousValue: { status: contribution.status },
      newValue: { status: 'VERIFIED', receiptNumber: receipt.receiptNumber, amount: contribution.amount },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: `Contribution verified successfully! Receipt ${receipt.receiptNumber} generated.`,
      receipt: {
        id: receipt.receiptId,
        receiptNumber: receipt.receiptNumber,
        qrCodeData: receipt.qrData,
        securityHash: receipt.securityHash
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Reject a contribution
router.post('/:id/reject', authenticateToken, forbidAuditorMutation, requireRoles('TREASURER', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { reason } = req.body;
    const contribution = await DB.get<any>(`SELECT * FROM contributions WHERE id = ?`, [req.params.id]);

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found.' });
    }

    if (contribution.status === 'VERIFIED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reject an already verified transaction. Use the refund/adjustment workflow.'
      });
    }

    await DB.run(
      `UPDATE contributions SET status = 'REJECTED', notes = COALESCE(notes || '\n', '') || ?, updated_at = datetime('now') WHERE id = ?`,
      [`Rejection Reason: ${reason || 'Not specified'} (By ${req.user?.fullName})`, req.params.id]
    );

    await logAudit({
      user: req.user,
      action: 'REJECT_CONTRIBUTION',
      entityType: 'CONTRIBUTION',
      entityId: req.params.id,
      previousValue: { status: contribution.status },
      newValue: { status: 'REJECTED', reason },
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Contribution rejected.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get digital receipt by receipt number
router.get('/receipt/:receiptNumber', async (req, res) => {
  try {
    const receipt = await DB.get<any>(
      `SELECT r.*, c.phone, c.purpose
       FROM receipts r
       JOIN contributions c ON c.id = r.contribution_id
       WHERE r.receipt_number = ?`,
      [req.params.receiptNumber]
    );

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found.' });
    }

    const amountInWords = ReceiptService.amountToWords(receipt.amount);

    return res.json({
      success: true,
      data: {
        ...receipt,
        amountInWords,
        organization: {
          name: 'SRI KRISHNA YADAV YOUTH GURAJA',
          monogram: 'SKY',
          address: 'Yadav Youth Bhavan, Main Road, Guraja, Krishna District, AP - 521321',
          contact: '+91 98480 22334 / contact@skyguraja.org'
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
