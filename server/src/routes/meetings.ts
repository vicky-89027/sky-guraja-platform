import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { authenticateToken, requireRoles, forbidAuditorMutation, AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/audit';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const meetings = await DB.query<any>(`
      SELECT m.*, u.full_name as created_by_name
      FROM meetings m
      LEFT JOIN users u ON u.id = m.created_by_id
      ORDER BY m.meeting_date DESC
    `);

    for (const m of meetings) {
      m.actionItems = await DB.query<any>(`
        SELECT a.*, mem.name as assigned_to_name
        FROM meeting_action_items a
        LEFT JOIN committee_members mem ON mem.id = a.assigned_to_id
        WHERE a.meeting_id = ?
        ORDER BY a.created_at ASC
      `, [m.id]);
    }

    return res.json({ success: true, data: meetings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authenticateToken, forbidAuditorMutation, requireRoles('SUPER_ADMIN', 'PRESIDENT', 'SECRETARY'), async (req: AuthRequest, res) => {
  try {
    const { title, meetingDate, location, agenda, decisions, actionItems = [] } = req.body;

    if (!title || !meetingDate || !agenda) {
      return res.status(400).json({ success: false, message: 'Meeting title, date, and agenda are required.' });
    }

    const meetingId = `mtg-${uuidv4().substring(0, 8)}`;

    await DB.run(
      `INSERT INTO meetings (id, title, meeting_date, location, agenda, decisions, created_by_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [meetingId, title, meetingDate, location || 'SKY Youth Bhavan, Guraja', agenda, decisions || null, req.user?.id]
    );

    if (Array.isArray(actionItems)) {
      for (const item of actionItems) {
        if (item.title) {
          const actionId = `act-${uuidv4().substring(0, 8)}`;
          await DB.run(
            `INSERT INTO meeting_action_items (id, meeting_id, title, description, assigned_to_id, deadline, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'))`,
            [actionId, meetingId, item.title, item.description || null, item.assignedToId || null, item.deadline || null]
          );
        }
      }
    }

    await logAudit({
      user: req.user,
      action: 'CREATE_MEETING',
      entityType: 'MEETING',
      entityId: meetingId,
      newValue: { title, meetingDate, actionItemsCount: actionItems.length },
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, message: 'Meeting & action items saved', meetingId });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/action-items/:id/status', authenticateToken, forbidAuditorMutation, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const completedAt = status === 'COMPLETED' ? new Date().toISOString() : null;

    await DB.run(
      `UPDATE meeting_action_items SET status = ?, completed_at = ? WHERE id = ?`,
      [status, completedAt, req.params.id]
    );

    return res.json({ success: true, message: 'Action item status updated' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
