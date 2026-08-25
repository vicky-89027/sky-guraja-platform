import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { AuthUser } from './auth';

export interface AuditLogOptions {
  user?: AuthUser | null;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
}

export async function logAudit({
  user,
  action,
  entityType,
  entityId,
  previousValue,
  newValue,
  ipAddress
}: AuditLogOptions): Promise<void> {
  const id = `aud-${uuidv4()}`;
  const userId = user?.id || null;
  const userName = user?.fullName || 'System / Anonymous';
  const userRole = user?.role || 'SYSTEM';

  const prevJson = previousValue !== undefined ? JSON.stringify(previousValue) : null;
  const newJson = newValue !== undefined ? JSON.stringify(newValue) : null;

  try {
    await DB.run(
      `INSERT INTO audit_logs (id, user_id, user_name, user_role, action, entity_type, entity_id, previous_value_json, new_value_json, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, userId, userName, userRole, action, entityType, entityId, prevJson, newJson, ipAddress || '127.0.0.1']
    );
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
