import { DB } from '../db/database';
import { AuthUser } from '../middleware/auth';

export interface ApprovalTier {
  id: string;
  tier_name: string;
  min_amount: number;
  max_amount: number | null;
  required_roles: string[];
}

export class ApprovalService {
  /**
   * Determine required approval tier for an amount from DB settings
   */
  static async getMatchingTier(amount: number): Promise<ApprovalTier | null> {
    const rows = await DB.query<{
      id: string;
      tier_name: string;
      min_amount: number;
      max_amount: number | null;
      required_roles_json: string;
    }>(
      `SELECT * FROM approval_thresholds 
       WHERE is_active = 1 AND min_amount <= ? AND (max_amount IS NULL OR max_amount >= ?)
       ORDER BY min_amount DESC LIMIT 1`,
      [amount, amount]
    );

    if (rows.length === 0) {
      // Fallback default
      return {
        id: 'tier-default',
        tier_name: 'Standard Approval Tier',
        min_amount: 0,
        max_amount: null,
        required_roles: ['TREASURER', 'PRESIDENT']
      };
    }

    const row = rows[0];
    let roles: string[] = [];
    try {
      roles = JSON.parse(row.required_roles_json);
    } catch {
      roles = ['TREASURER'];
    }

    return {
      id: row.id,
      tier_name: row.tier_name,
      min_amount: row.min_amount,
      max_amount: row.max_amount,
      required_roles: roles
    };
  }

  /**
   * Evaluates if all required roles have approved
   */
  static isFullyApproved(requiredRoles: string[], approvedRoles: string[]): boolean {
    return requiredRoles.every((r) => approvedRoles.includes(r));
  }
}
