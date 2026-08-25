import { Router } from 'express';
import { DB } from '../db/database';
import { authenticateToken, requireRoles, forbidAuditorMutation, AuthRequest } from '../middleware/auth';
import { LedgerService } from '../services/ledgerService';

const router = Router();

// Get full financial ledger entries with filters
router.get('/entries', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { entryType, category, campaignId, startDate, endDate, limit = 100, offset = 0 } = req.query;

    let sql = `
      SELECT 
        l.*,
        cmp.name as campaign_name,
        u.full_name as actor_name
      FROM ledger_entries l
      LEFT JOIN campaigns cmp ON cmp.id = l.campaign_id
      LEFT JOIN users u ON u.id = l.actor_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (entryType) {
      sql += ` AND l.entry_type = ?`;
      params.push(entryType);
    }
    if (category) {
      sql += ` AND l.category = ?`;
      params.push(category);
    }
    if (campaignId) {
      sql += ` AND l.campaign_id = ?`;
      params.push(campaignId);
    }
    if (startDate) {
      sql += ` AND l.created_at >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND l.created_at <= ?`;
      params.push(endDate);
    }

    sql += ` ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const entries = await DB.query<any>(sql, params);
    const summary = await LedgerService.getSummary();

    return res.json({
      success: true,
      data: {
        summary,
        entries
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Post an official financial adjustment / reversal record (Rule 2)
router.post('/adjustment', authenticateToken, forbidAuditorMutation, requireRoles('SUPER_ADMIN', 'TREASURER'), async (req: AuthRequest, res) => {
  try {
    const { originalEntityId, entityType, adjustmentType, amount, reason } = req.body;

    if (!originalEntityId || !entityType || !adjustmentType || !amount || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Original entity ID, entity type, adjustment type, amount, and reason are required.'
      });
    }

    const entryId = await LedgerService.postAdjustment(
      originalEntityId,
      entityType,
      adjustmentType,
      Number(amount),
      reason,
      req.user!
    );

    return res.json({
      success: true,
      message: 'Ledger adjustment posted successfully.',
      entryId
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
