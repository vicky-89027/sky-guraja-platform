import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { authenticateToken, requireRoles, forbidAuditorMutation, AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/audit';

const router = Router();

// List all campaigns with real-time collected & spent totals
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const campaigns = await DB.query<any>(`
      SELECT 
        c.*,
        m.name as organizer_name,
        COALESCE((SELECT SUM(amount) FROM contributions WHERE campaign_id = c.id AND status = 'VERIFIED'), 0) as collected_amount,
        COALESCE((SELECT COUNT(*) FROM contributions WHERE campaign_id = c.id AND status = 'VERIFIED'), 0) as verified_donors_count,
        COALESCE((SELECT SUM(amount) FROM expenses WHERE campaign_id = c.id AND approval_status = 'PAID'), 0) as spent_amount,
        COALESCE((SELECT SUM(target_amount) FROM collection_assignments WHERE campaign_id = c.id), 0) as assigned_quota_total
      FROM campaigns c
      LEFT JOIN committee_members m ON m.id = c.organizer_id
      ORDER BY c.status ASC, c.start_date DESC
    `);

    return res.json({ success: true, data: campaigns });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get campaign details with assignments & contributor breakdown
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const campaign = await DB.get<any>(
      `SELECT c.*, m.name as organizer_name
       FROM campaigns c
       LEFT JOIN committee_members m ON m.id = c.organizer_id
       WHERE c.id = ?`,
      [req.params.id]
    );

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const assignments = await DB.query<any>(
      `SELECT 
        a.*, 
        m.name as member_name, 
        m.role_title,
        COALESCE((SELECT SUM(amount) FROM contributions WHERE campaign_id = a.campaign_id AND collected_by_id = a.member_id AND status = 'VERIFIED'), 0) as collected_amount
       FROM collection_assignments a
       JOIN committee_members m ON m.id = a.member_id
       WHERE a.campaign_id = ?`,
      [campaign.id]
    );

    const contributions = await DB.query<any>(
      `SELECT c.*, m.name as collector_name, r.receipt_number
       FROM contributions c
       LEFT JOIN committee_members m ON m.id = c.collected_by_id
       LEFT JOIN receipts r ON r.id = c.receipt_id
       WHERE c.campaign_id = ?
       ORDER BY c.created_at DESC`,
      [campaign.id]
    );

    const expenses = await DB.query<any>(
      `SELECT e.*, m.name as requester_name
       FROM expenses e
       JOIN committee_members m ON m.id = e.requested_by_id
       WHERE e.campaign_id = ?
       ORDER BY e.created_at DESC`,
      [campaign.id]
    );

    return res.json({
      success: true,
      data: {
        ...campaign,
        assignments,
        contributions,
        expenses
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Create campaign
router.post('/', authenticateToken, forbidAuditorMutation, requireRoles('SUPER_ADMIN', 'PRESIDENT', 'SECRETARY', 'TREASURER'), async (req: AuthRequest, res) => {
  try {
    const { name, description, targetAmount, startDate, endDate, category, organizerId, isPublic = 1 } = req.body;

    if (!name || !targetAmount || !startDate || !category) {
      return res.status(400).json({ success: false, message: 'Name, target amount, start date, and category are required.' });
    }

    const campaignId = `cmp-${uuidv4().substring(0, 8)}`;

    await DB.run(
      `INSERT INTO campaigns (id, name, description, target_amount, start_date, end_date, category, organizer_id, status, is_public, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, datetime('now'), datetime('now'))`,
      [campaignId, name, description, Number(targetAmount), startDate, endDate || null, category, organizerId || null, isPublic ? 1 : 0]
    );

    await logAudit({
      user: req.user,
      action: 'CREATE_CAMPAIGN',
      entityType: 'CAMPAIGN',
      entityId: campaignId,
      newValue: { name, targetAmount, category },
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, message: 'Campaign created successfully', campaignId });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Assign collection quota to a member
router.post('/:id/assign', authenticateToken, forbidAuditorMutation, requireRoles('SUPER_ADMIN', 'PRESIDENT', 'SECRETARY', 'TREASURER'), async (req: AuthRequest, res) => {
  try {
    const { memberId, targetAmount } = req.body;
    if (!memberId || !targetAmount) {
      return res.status(400).json({ success: false, message: 'Member and target amount are required.' });
    }

    const assignmentId = `asg-${uuidv4().substring(0, 8)}`;
    await DB.run(
      `INSERT INTO collection_assignments (id, campaign_id, member_id, target_amount, status, assigned_at, updated_at)
       VALUES (?, ?, ?, ?, 'IN_PROGRESS', datetime('now'), datetime('now'))`,
      [assignmentId, req.params.id, memberId, Number(targetAmount)]
    );

    await logAudit({
      user: req.user,
      action: 'ASSIGN_COLLECTION_QUOTA',
      entityType: 'COLLECTION_ASSIGNMENT',
      entityId: assignmentId,
      newValue: { campaignId: req.params.id, memberId, targetAmount },
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Collection quota assigned to member!' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
