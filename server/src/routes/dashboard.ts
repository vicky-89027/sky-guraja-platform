import { Router } from 'express';
import { DB } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { LedgerService } from '../services/ledgerService';

const router = Router();

router.get('/overview', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const summary = await LedgerService.getSummary();

    // Counts
    const activeCampaigns = await DB.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM campaigns WHERE status = 'ACTIVE'`
    );
    const activeMembers = await DB.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM committee_members WHERE active = 1`
    );
    const upcomingEvents = await DB.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM events WHERE status = 'UPCOMING'`
    );
    const pendingApprovals = await DB.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM expenses WHERE approval_status IN ('SUBMITTED', 'UNDER_REVIEW')`
    );

    // Campaigns progress with verified collections and actual expenses
    const campaignsProgress = await DB.query<any>(`
      SELECT 
        c.id, c.name, c.target_amount, c.category, c.status,
        COALESCE((SELECT SUM(amount) FROM contributions WHERE campaign_id = c.id AND status = 'VERIFIED'), 0) as collected_amount,
        COALESCE((SELECT COUNT(*) FROM contributions WHERE campaign_id = c.id AND status = 'VERIFIED'), 0) as contributors_count,
        COALESCE((SELECT SUM(amount) FROM expenses WHERE campaign_id = c.id AND approval_status = 'PAID'), 0) as spent_amount
      FROM campaigns c
      ORDER BY c.status ASC, c.created_at DESC
    `);

    // Monthly trends (Last 6 months from ledger)
    const monthlyTrends = await DB.query<any>(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COALESCE(SUM(CASE WHEN entry_type IN ('CREDIT', 'ADJUSTMENT_CREDIT') THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN entry_type IN ('DEBIT', 'ADJUSTMENT_DEBIT') THEN amount ELSE 0 END), 0) as expense
      FROM ledger_entries
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
      LIMIT 6
    `);

    // Category-wise expenses
    const expenseCategories = await DB.query<any>(`
      SELECT category, SUM(amount) as total_amount, COUNT(*) as count
      FROM expenses
      WHERE approval_status = 'PAID'
      GROUP BY category
      ORDER BY total_amount DESC
    `);

    // Recent Contributions (Last 5)
    const recentContributions = await DB.query<any>(`
      SELECT c.*, cmp.name as campaign_name, m.name as collector_name
      FROM contributions c
      JOIN campaigns cmp ON cmp.id = c.campaign_id
      LEFT JOIN committee_members m ON m.id = c.collected_by_id
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

    // Recent Expenses (Last 5)
    const recentExpenses = await DB.query<any>(`
      SELECT e.*, cmp.name as campaign_name, m.name as requester_name
      FROM expenses e
      LEFT JOIN campaigns cmp ON cmp.id = e.campaign_id
      JOIN committee_members m ON m.id = e.requested_by_id
      ORDER BY e.created_at DESC
      LIMIT 5
    `);

    // Recent Activities / Audit Logs
    const recentActivities = await DB.query<any>(`
      SELECT * FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 8
    `);

    return res.json({
      success: true,
      data: {
        summary: {
          ...summary,
          activeCampaignsCount: activeCampaigns?.count || 0,
          activeMembersCount: activeMembers?.count || 0,
          upcomingEventsCount: upcomingEvents?.count || 0,
          pendingApprovalsCount: pendingApprovals?.count || 0
        },
        campaignsProgress,
        monthlyTrends: monthlyTrends.reverse(),
        expenseCategories,
        recentContributions,
        recentExpenses,
        recentActivities
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
