import { Router } from 'express';
import { DB } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { LedgerService } from '../services/ledgerService';

const router = Router();

// Full comprehensive financial report
router.get('/financial-statement', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const summary = await LedgerService.getSummary();

    const monthlyLedger = await DB.query<any>(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        SUM(CASE WHEN entry_type IN ('CREDIT', 'ADJUSTMENT_CREDIT') THEN amount ELSE 0 END) as credits,
        SUM(CASE WHEN entry_type IN ('DEBIT', 'ADJUSTMENT_DEBIT') THEN amount ELSE 0 END) as debits
      FROM ledger_entries
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month ASC
    `);

    const campaignFinancials = await DB.query<any>(`
      SELECT 
        c.name as campaign_name,
        c.target_amount,
        COALESCE(SUM(CASE WHEN l.entry_type = 'CREDIT' THEN l.amount ELSE 0 END), 0) as total_collected,
        COALESCE(SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END), 0) as total_spent
      FROM campaigns c
      LEFT JOIN ledger_entries l ON l.campaign_id = c.id
      GROUP BY c.id
    `);

    const expenseCategoryBreakdown = await DB.query<any>(`
      SELECT category, SUM(amount) as total_amount, COUNT(*) as count
      FROM expenses
      WHERE approval_status = 'PAID'
      GROUP BY category
      ORDER BY total_amount DESC
    `);

    return res.json({
      success: true,
      data: {
        generatedAt: new Date().toISOString(),
        summary,
        monthlyLedger,
        campaignFinancials,
        expenseCategoryBreakdown
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Member performance report
router.get('/members-performance', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const members = await DB.query<any>(`
      SELECT 
        m.name,
        m.role_title,
        m.area_location,
        COALESCE((SELECT SUM(target_amount) FROM collection_assignments WHERE member_id = m.id), 0) as assigned_target,
        COALESCE((SELECT SUM(amount) FROM contributions WHERE collected_by_id = m.id AND status = 'VERIFIED'), 0) as verified_collected,
        COALESCE((SELECT SUM(amount) FROM contributions WHERE collected_by_id = m.id AND status IN ('PENDING', 'SUBMITTED')), 0) as pending_verification_amount,
        COALESCE((SELECT COUNT(*) FROM contributions WHERE collected_by_id = m.id AND status = 'VERIFIED'), 0) as verified_donations_count
      FROM committee_members m
      WHERE m.active = 1
      ORDER BY verified_collected DESC
    `);

    return res.json({ success: true, data: members });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Export CSV
router.get('/export-csv/:type', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { type } = req.params;
    let csv = '';

    if (type === 'contributions') {
      const rows = await DB.query<any>(`
        SELECT 
          r.receipt_number, c.donor_name, c.phone, c.amount, c.date, cmp.name as campaign,
          c.payment_method, c.reference_no, c.status, m.name as collector
        FROM contributions c
        JOIN campaigns cmp ON cmp.id = c.campaign_id
        LEFT JOIN receipts r ON r.id = c.receipt_id
        LEFT JOIN committee_members m ON m.id = c.collected_by_id
        ORDER BY c.date DESC
      `);

      csv = 'Receipt No,Donor Name,Phone,Amount (INR),Date,Campaign,Payment Method,Reference No,Status,Collected By\n';
      rows.forEach((r) => {
        csv += `"${r.receipt_number || ''}","${r.donor_name}","${r.phone}",${r.amount},"${r.date}","${r.campaign}","${r.payment_method}","${r.reference_no || ''}","${r.status}","${r.collector || ''}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sky_contributions_report.csv"');
      return res.send(csv);
    } else if (type === 'expenses') {
      const rows = await DB.query<any>(`
        SELECT 
          e.id, e.amount, e.category, e.description, cmp.name as campaign, e.vendor_name,
          e.date, e.payment_method, e.approval_status, m.name as requested_by
        FROM expenses e
        LEFT JOIN campaigns cmp ON cmp.id = e.campaign_id
        JOIN committee_members m ON m.id = e.requested_by_id
        ORDER BY e.date DESC
      `);

      csv = 'Expense ID,Amount (INR),Category,Description,Campaign,Vendor,Date,Payment Method,Status,Requested By\n';
      rows.forEach((r) => {
        csv += `"${r.id}",${r.amount},"${r.category}","${r.description.replace(/"/g, '""')}","${r.campaign || 'General'}","${r.vendor_name}","${r.date}","${r.payment_method}","${r.approval_status}","${r.requested_by}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sky_expenses_report.csv"');
      return res.send(csv);
    } else if (type === 'ledger') {
      const rows = await DB.query<any>(`
        SELECT transaction_ref, entry_type, amount, balance_after, category, description, created_at
        FROM ledger_entries
        ORDER BY created_at ASC
      `);

      csv = 'Transaction Ref,Type,Amount (INR),Balance After (INR),Category,Description,Timestamp\n';
      rows.forEach((r) => {
        csv += `"${r.transaction_ref}","${r.entry_type}",${r.amount},${r.balance_after},"${r.category}","${r.description.replace(/"/g, '""')}","${r.created_at}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sky_ledger_statement.csv"');
      return res.send(csv);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid export type requested.' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
