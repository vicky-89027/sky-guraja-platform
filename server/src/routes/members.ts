import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { authenticateToken, requireRoles, forbidAuditorMutation, AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/audit';

const router = Router();

// List members with performance stats
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const members = await DB.query<any>(`
      SELECT 
        m.*,
        u.username,
        u.role as system_role,
        COALESCE((SELECT SUM(amount) FROM contributions WHERE collected_by_id = m.id AND status = 'VERIFIED'), 0) as total_verified_collected,
        COALESCE((SELECT COUNT(*) FROM contributions WHERE collected_by_id = m.id AND status = 'VERIFIED'), 0) as verified_collections_count,
        COALESCE((SELECT SUM(target_amount) FROM collection_assignments WHERE member_id = m.id), 0) as total_assigned_target
      FROM committee_members m
      LEFT JOIN users u ON u.id = m.user_id
      ORDER BY m.active DESC, m.name ASC
    `);

    return res.json({ success: true, data: members });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Create new member
router.post('/', authenticateToken, forbidAuditorMutation, requireRoles('SUPER_ADMIN', 'PRESIDENT', 'SECRETARY'), async (req: AuthRequest, res) => {
  try {
    const { name, roleTitle, phone, email, joiningDate, areaLocation, assignedResponsibilities } = req.body;

    if (!name || !roleTitle || !phone || !areaLocation) {
      return res.status(400).json({ success: false, message: 'Name, role title, phone, and area location are required.' });
    }

    const memberId = `mem-${uuidv4().substring(0, 8)}`;
    await DB.run(
      `INSERT INTO committee_members (id, name, role_title, phone, email, joining_date, area_location, active, assigned_responsibilities, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, datetime('now'))`,
      [
        memberId,
        name,
        roleTitle,
        phone,
        email || null,
        joiningDate || new Date().toISOString().split('T')[0],
        areaLocation,
        assignedResponsibilities || null
      ]
    );

    await logAudit({
      user: req.user,
      action: 'CREATE_MEMBER',
      entityType: 'MEMBER',
      entityId: memberId,
      newValue: { name, roleTitle, phone, areaLocation },
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, message: 'Committee member added successfully', memberId });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle member active status (Rule 7: Never delete historical records)
router.patch('/:id/status', authenticateToken, forbidAuditorMutation, requireRoles('SUPER_ADMIN', 'PRESIDENT', 'SECRETARY'), async (req: AuthRequest, res) => {
  try {
    const { active } = req.body;
    const member = await DB.get<any>(`SELECT * FROM committee_members WHERE id = ?`, [req.params.id]);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const newActiveState = active ? 1 : 0;
    await DB.run(`UPDATE committee_members SET active = ? WHERE id = ?`, [newActiveState, member.id]);

    await logAudit({
      user: req.user,
      action: newActiveState ? 'ACTIVATE_MEMBER' : 'DEACTIVATE_MEMBER',
      entityType: 'MEMBER',
      entityId: member.id,
      previousValue: { active: member.active },
      newValue: { active: newActiveState },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: `Member status updated to ${newActiveState ? 'Active' : 'Inactive'}`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
