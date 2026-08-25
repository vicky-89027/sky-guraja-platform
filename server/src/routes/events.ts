import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { authenticateToken, requireRoles, forbidAuditorMutation, AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/audit';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const events = await DB.query<any>(`
      SELECT 
        e.*,
        m.name as coordinator_name,
        cmp.name as campaign_name,
        COALESCE((SELECT SUM(amount) FROM expenses WHERE event_id = e.id AND approval_status = 'PAID'), 0) as actual_expenses_sum
      FROM events e
      LEFT JOIN committee_members m ON m.id = e.coordinator_id
      LEFT JOIN campaigns cmp ON cmp.id = e.campaign_id
      ORDER BY e.event_date DESC
    `);
    return res.json({ success: true, data: events });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authenticateToken, forbidAuditorMutation, requireRoles('SUPER_ADMIN', 'PRESIDENT', 'SECRETARY'), async (req: AuthRequest, res) => {
  try {
    const { name, description, eventDate, eventTime, venue, coordinatorId, budget, campaignId, participantsCount } = req.body;

    if (!name || !eventDate || !venue) {
      return res.status(400).json({ success: false, message: 'Event name, date, and venue are required.' });
    }

    const eventId = `evt-${uuidv4().substring(0, 8)}`;
    await DB.run(
      `INSERT INTO events (id, name, description, event_date, event_time, venue, coordinator_id, budget, campaign_id, participants_count, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UPCOMING', datetime('now'))`,
      [eventId, name, description, eventDate, eventTime || null, venue, coordinatorId || null, Number(budget) || 0, campaignId || null, Number(participantsCount) || 0]
    );

    await logAudit({
      user: req.user,
      action: 'CREATE_EVENT',
      entityType: 'EVENT',
      entityId: eventId,
      newValue: { name, eventDate, venue, budget },
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, message: 'Event created successfully', eventId });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
