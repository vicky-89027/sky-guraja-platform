import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sky_guraja_super_secret_jwt_key_2026';

export type UserRole = 'SUPER_ADMIN' | 'PRESIDENT' | 'SECRETARY' | 'TREASURER' | 'MEMBER' | 'AUDITOR';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  memberId?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      memberId: user.memberId
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
    }
    req.user = decoded as AuthUser;
    next();
  });
}

export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (req.user.role === 'SUPER_ADMIN') {
      return next(); // Super admin has access everywhere
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized for this action.`
      });
    }

    next();
  };
}

export function forbidAuditorMutation(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role === 'AUDITOR' && req.method !== 'GET') {
    return res.status(403).json({
      success: false,
      message: 'Auditors have STRICT READ-ONLY access and cannot modify financial or organizational records.'
    });
  }
  next();
}
