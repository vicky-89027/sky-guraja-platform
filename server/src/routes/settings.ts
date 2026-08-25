import { Router } from 'express';
import { DB } from '../db/database';
import { authenticateToken, requireRoles, forbidAuditorMutation, AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/audit';

const router = Router();

// Get all organization settings & approval thresholds
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const settingsRows = await DB.query<any>(`SELECT * FROM organization_settings`);
    const thresholds = await DB.query<any>(`SELECT * FROM approval_thresholds ORDER BY min_amount ASC`);

    const settingsObj: Record<string, string> = {};
    settingsRows.forEach((r) => {
      settingsObj[r.key] = r.value;
    });

    const parsedThresholds = thresholds.map((t) => ({
      ...t,
      required_roles: JSON.parse(t.required_roles_json || '[]')
    }));

    return res.json({
      success: true,
      data: {
        settings: settingsObj,
        thresholds: parsedThresholds
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update Organization Settings (Super Admin only)
router.post('/', authenticateToken, forbidAuditorMutation, requireRoles('SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { settings } = req.body; // Key-value map
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Settings object is required.' });
    }

    for (const [key, val] of Object.entries(settings)) {
      await DB.run(
        `INSERT INTO organization_settings (key, value, updated_by_id, updated_at)
         VALUES (?, ?, ?, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_by_id = excluded.updated_by_id, updated_at = datetime('now')`,
        [key, String(val), req.user?.id]
      );
    }

    await logAudit({
      user: req.user,
      action: 'UPDATE_ORGANIZATION_SETTINGS',
      entityType: 'SETTINGS',
      entityId: 'global_settings',
      newValue: settings,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Organization settings updated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update Approval Thresholds (Super Admin only)
router.post('/thresholds', authenticateToken, forbidAuditorMutation, requireRoles('SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { thresholds } = req.body;
    if (!Array.isArray(thresholds)) {
      return res.status(400).json({ success: false, message: 'Thresholds array is required.' });
    }

    for (const t of thresholds) {
      if (t.id) {
        await DB.run(
          `UPDATE approval_thresholds 
           SET tier_name = ?, min_amount = ?, max_amount = ?, required_roles_json = ?, is_active = ?
           WHERE id = ?`,
          [
            t.tier_name,
            Number(t.min_amount),
            t.max_amount ? Number(t.max_amount) : null,
            JSON.stringify(t.required_roles || ['TREASURER']),
            t.is_active !== undefined ? (t.is_active ? 1 : 0) : 1,
            t.id
          ]
        );
      }
    }

    await logAudit({
      user: req.user,
      action: 'UPDATE_APPROVAL_THRESHOLDS',
      entityType: 'SETTINGS',
      entityId: 'approval_thresholds',
      newValue: thresholds,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Approval threshold tiers updated.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
