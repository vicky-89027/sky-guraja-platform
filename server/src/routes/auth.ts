import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { DB } from '../db/database';
import { generateToken, authenticateToken, AuthRequest, AuthUser } from '../middleware/auth';
import { logAudit } from '../middleware/audit';

const router = Router();

// Login with email or phone + password
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone or username
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier (email/phone) and password are required.' });
    }

    const user = await DB.get<any>(
      `SELECT u.*, m.id as member_id, m.name as member_name 
       FROM users u 
       LEFT JOIN committee_members m ON m.user_id = u.id 
       WHERE (u.email = ? OR u.phone = ? OR u.username = ?) AND u.is_active = 1`,
      [identifier.trim(), identifier.trim(), identifier.trim()]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or inactive account.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Update last login
    await DB.run(`UPDATE users SET last_login = datetime('now') WHERE id = ?`, [user.id]);

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      memberId: user.member_id || undefined
    };

    const token = generateToken(authUser);

    await logAudit({
      user: authUser,
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id,
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: `Welcome, ${user.full_name}!`,
      token,
      user: authUser
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Quick switch demo role (For local pairing & testing all roles smoothly)
router.post('/demo-switch', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await DB.get<any>(
      `SELECT u.*, m.id as member_id 
       FROM users u 
       LEFT JOIN committee_members m ON m.user_id = u.id 
       WHERE u.role = ? AND u.is_active = 1 LIMIT 1`,
      [role]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: `No active demo user found for role ${role}` });
    }

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      memberId: user.member_id || undefined
    };

    const token = generateToken(authUser);

    return res.json({
      success: true,
      message: `Switched active role to ${user.role} (${user.full_name})`,
      token,
      user: authUser
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get Current User
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// List all available accounts for test login switcher
router.get('/demo-accounts', async (req, res) => {
  try {
    const users = await DB.query<any>(
      `SELECT u.id, u.username, u.email, u.phone, u.full_name, u.role, m.role_title
       FROM users u
       LEFT JOIN committee_members m ON m.user_id = u.id
       WHERE u.is_active = 1
       ORDER BY CASE u.role 
         WHEN 'SUPER_ADMIN' THEN 1 
         WHEN 'PRESIDENT' THEN 2 
         WHEN 'SECRETARY' THEN 3 
         WHEN 'TREASURER' THEN 4 
         WHEN 'MEMBER' THEN 5 
         WHEN 'AUDITOR' THEN 6 
         ELSE 7 END`
    );
    return res.json({ success: true, accounts: users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
