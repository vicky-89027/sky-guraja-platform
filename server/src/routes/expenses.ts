import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { authenticateToken, requireRoles, forbidAuditorMutation, AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/audit';
import { ApprovalService } from '../services/approvalService';
import { LedgerService } from '../services/ledgerService';

const router = Router();

// List expenses with search & filters
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { search, category, status, campaignId, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT 
        e.*,
        cmp.name as campaign_name,
        ev.name as event_name,
        m.name as requested_by_name,
        t.tier_name
      FROM expenses e
      LEFT JOIN campaigns cmp ON cmp.id = e.campaign_id
      LEFT JOIN events ev ON ev.id = e.event_id
      JOIN committee_members m ON m.id = e.requested_by_id
      LEFT JOIN approval_thresholds t ON t.id = e.current_tier_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (e.description LIKE ? OR e.vendor_name LIKE ? OR m.name LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (category) {
      sql += ` AND e.category = ?`;
      params.push(category);
    }
    if (status) {
      sql += ` AND e.approval_status = ?`;
      params.push(status);
    }
    if (campaignId) {
      sql += ` AND e.campaign_id = ?`;
      params.push(campaignId);
    }

    sql += ` ORDER BY e.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const items = await DB.query<any>(sql, params);
    const totalRow = await DB.get<{ count: number }>(`SELECT COUNT(*) as count FROM expenses`);

    // Attach required tier info to each item
    for (const item of items) {
      const tier = await ApprovalService.getMatchingTier(item.amount);
      item.requiredRoles = tier?.required_roles || ['TREASURER'];
      try {
        item.approvedRoles = JSON.parse(item.approved_by_roles_json || '[]');
      } catch {
        item.approvedRoles = [];
      }
    }

    return res.json({
      success: true,
      data: items,
      total: totalRow?.count || 0
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Submit a new expense request
router.post('/', authenticateToken, forbidAuditorMutation, async (req: AuthRequest, res) => {
  try {
    const {
      amount,
      category,
      description,
      campaignId,
      eventId,
      vendorName,
      paymentMethod = 'UPI',
      supportingBillUrl,
      notes,
      requestedById
    } = req.body;

    if (!amount || !category || !description || !vendorName) {
      return res.status(400).json({
        success: false,
        message: 'Amount, category, description, and vendor name are required.'
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Expense amount must be positive.' });
    }

    const requesterMemberId = requestedById || req.user?.memberId;
    if (!requesterMemberId) {
      return res.status(400).json({
        success: false,
        message: 'You must be linked to a committee member profile or select a requester.'
      });
    }

    // Determine approval tier dynamically based on amount
    const matchingTier = await ApprovalService.getMatchingTier(numericAmount);
    const expenseId = `exp-${uuidv4().substring(0, 8)}`;

    await DB.run(
      `INSERT INTO expenses (
        id, amount, category, description, campaign_id, event_id,
        requested_by_id, date, vendor_name, payment_method, supporting_bill_url,
        approval_status, current_tier_id, approved_by_roles_json, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, 'SUBMITTED', ?, '[]', ?, datetime('now'), datetime('now'))`,
      [
        expenseId,
        numericAmount,
        category,
        description,
        campaignId || null,
        eventId || null,
        requesterMemberId,
        vendorName,
        paymentMethod,
        supportingBillUrl || null,
        matchingTier?.id || null,
        notes || null
      ]
    );

    await logAudit({
      user: req.user,
      action: 'SUBMIT_EXPENSE',
      entityType: 'EXPENSE',
      entityId: expenseId,
      newValue: {
        amount: numericAmount,
        category,
        vendorName,
        requiredTier: matchingTier?.tier_name,
        requiredRoles: matchingTier?.required_roles
      },
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: `Expense request of ₹${numericAmount.toLocaleString('en-IN')} submitted. Required approvals: ${matchingTier?.required_roles.join(', ')}`,
      data: {
        expenseId,
        requiredTier: matchingTier
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Approve expense by role (President, Secretary, Treasurer, Super Admin)
router.post('/:id/approve', authenticateToken, forbidAuditorMutation, requireRoles('TREASURER', 'SECRETARY', 'PRESIDENT', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { notes } = req.body;
    const expense = await DB.get<any>(`SELECT * FROM expenses WHERE id = ?`, [req.params.id]);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found.' });
    }

    if (expense.approval_status === 'PAID') {
      return res.status(400).json({ success: false, message: 'Expense has already been paid.' });
    }

    if (expense.approval_status === 'REJECTED') {
      return res.status(400).json({ success: false, message: 'Cannot approve a rejected expense.' });
    }

    const tier = await ApprovalService.getMatchingTier(expense.amount);
    const requiredRoles = tier?.required_roles || ['TREASURER'];

    let approvedRoles: string[] = [];
    try {
      approvedRoles = JSON.parse(expense.approved_by_roles_json || '[]');
    } catch {
      approvedRoles = [];
    }

    const userRole = req.user?.role!;
    const effectiveRole = userRole === 'SUPER_ADMIN' ? requiredRoles[0] : userRole;

    if (!requiredRoles.includes(effectiveRole) && userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: `Your role '${userRole}' is not in the required approval chain (${requiredRoles.join(', ')}) for ₹${expense.amount}`
      });
    }

    if (!approvedRoles.includes(userRole)) {
      approvedRoles.push(userRole);
    }
    // Super admin can fulfill all roles if requested
    if (userRole === 'SUPER_ADMIN') {
      for (const r of requiredRoles) {
        if (!approvedRoles.includes(r)) approvedRoles.push(r);
      }
    }

    const isFullyApproved = ApprovalService.isFullyApproved(requiredRoles, approvedRoles);
    const newStatus = isFullyApproved ? 'APPROVED' : 'UNDER_REVIEW';

    // Record individual approval log
    await DB.run(
      `INSERT INTO expense_approvals (id, expense_id, approver_id, role, decision, notes, decided_at)
       VALUES (?, ?, ?, ?, 'APPROVED', ?, datetime('now'))`,
      [`appr-${uuidv4().substring(0, 8)}`, expense.id, req.user?.id, userRole, notes || 'Approved']
    );

    // Update expense record
    await DB.run(
      `UPDATE expenses 
       SET approval_status = ?, approved_by_roles_json = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [newStatus, JSON.stringify(approvedRoles), expense.id]
    );

    await logAudit({
      user: req.user,
      action: 'APPROVE_EXPENSE',
      entityType: 'EXPENSE',
      entityId: expense.id,
      previousValue: { approval_status: expense.approval_status, approved_by_roles: expense.approved_by_roles_json },
      newValue: { approval_status: newStatus, approved_by_roles: approvedRoles },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: isFullyApproved
        ? 'Expense is now FULLY APPROVED and ready for disbursement!'
        : `Approval recorded by ${userRole}. Still waiting for: ${requiredRoles.filter((r) => !approvedRoles.includes(r)).join(', ')}`,
      data: {
        status: newStatus,
        isFullyApproved,
        approvedRoles,
        requiredRoles
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Reject expense
router.post('/:id/reject', authenticateToken, forbidAuditorMutation, requireRoles('TREASURER', 'SECRETARY', 'PRESIDENT', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { reason } = req.body;
    const expense = await DB.get<any>(`SELECT * FROM expenses WHERE id = ?`, [req.params.id]);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    await DB.run(
      `UPDATE expenses 
       SET approval_status = 'REJECTED', notes = COALESCE(notes || '\n', '') || ?, updated_at = datetime('now')
       WHERE id = ?`,
      [`Rejection Reason: ${reason || 'Not specified'} (By ${req.user?.fullName} - ${req.user?.role})`, expense.id]
    );

    await logAudit({
      user: req.user,
      action: 'REJECT_EXPENSE',
      entityType: 'EXPENSE',
      entityId: expense.id,
      previousValue: { approval_status: expense.approval_status },
      newValue: { approval_status: 'REJECTED', reason },
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Expense has been rejected.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Mark expense as PAID / Disbursed (Treasurer or Super Admin only)
// Posts strict DEBIT to ledger and updates balance
router.post('/:id/payout', authenticateToken, forbidAuditorMutation, requireRoles('TREASURER', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const expense = await DB.get<any>(
      `SELECT e.*, cmp.name as campaign_name FROM expenses e LEFT JOIN campaigns cmp ON cmp.id = e.campaign_id WHERE e.id = ?`,
      [req.params.id]
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    if (expense.approval_status !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: `Expense cannot be paid because status is '${expense.approval_status}'. Must be 'APPROVED' by all required tiers first.`
      });
    }

    // Post to ledger (Throws error if insufficient funds)
    const ledgerEntryId = await LedgerService.postExpenseDebit(
      expense.id,
      expense.amount,
      expense.category,
      expense.campaign_id,
      `EXP-${expense.id}`,
      `Disbursed ₹${expense.amount} to ${expense.vendor_name} for ${expense.description}`,
      req.user
    );

    // Update expense record
    await DB.run(
      `UPDATE expenses 
       SET approval_status = 'PAID', paid_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ?`,
      [expense.id]
    );

    await logAudit({
      user: req.user,
      action: 'DISBURSE_EXPENSE',
      entityType: 'EXPENSE',
      entityId: expense.id,
      newValue: {
        amount: expense.amount,
        vendor: expense.vendor_name,
        ledgerEntryId,
        status: 'PAID'
      },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: `Expense of ₹${expense.amount.toLocaleString('en-IN')} paid and posted to ledger debit successfully!`,
      ledgerEntryId
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
