import { Router } from 'express';
import { DB } from '../db/database';
import { authenticateToken, requireRoles, AuthRequest } from '../middleware/auth';

const router = Router();

// Get audit logs with filter & search (Super Admin, Auditor, President, Secretary, Treasurer)
router.get('/', authenticateToken, requireRoles('SUPER_ADMIN', 'AUDITOR', 'PRESIDENT', 'SECRETARY', 'TREASURER'), async (req: AuthRequest, res) => {
  try {
    const { search, entityType, action, startDate, endDate, limit = 50, offset = 0 } = req.query;

    let sql = `SELECT * FROM audit_logs WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      sql += ` AND (user_name LIKE ? OR action LIKE ? OR entity_id LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (entityType) {
      sql += ` AND entity_type = ?`;
      params.push(entityType);
    }
    if (action) {
      sql += ` AND action = ?`;
      params.push(action);
    }
    if (startDate) {
      sql += ` AND created_at >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND created_at <= ?`;
      params.push(endDate);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const logs = await DB.query<any>(sql, params);
    const countRow = await DB.get<{ count: number }>(`SELECT COUNT(*) as count FROM audit_logs`);

    return res.json({
      success: true,
      data: logs,
      total: countRow?.count || 0
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
