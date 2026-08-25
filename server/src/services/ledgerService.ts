import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';
import { logAudit } from '../middleware/audit';
import { AuthUser } from '../middleware/auth';

export interface LedgerSummary {
  openingBalance: number;
  totalVerifiedContributions: number;
  totalVerifiedIncome: number;
  totalPaidExpenses: number;
  totalApprovedRefunds: number;
  currentAvailableBalance: number;
  pendingCollections: number;
  pendingExpenses: number;
  totalEntriesCount: number;
}

export class LedgerService {
  /**
   * Derive current available balance strictly from verified ledger entries
   */
  static async getCurrentBalance(): Promise<number> {
    const credits = await DB.get<{ sum: number }>(
      `SELECT COALESCE(SUM(amount), 0) as sum FROM ledger_entries WHERE entry_type IN ('CREDIT', 'ADJUSTMENT_CREDIT')`
    );
    const debits = await DB.get<{ sum: number }>(
      `SELECT COALESCE(SUM(amount), 0) as sum FROM ledger_entries WHERE entry_type IN ('DEBIT', 'ADJUSTMENT_DEBIT')`
    );

    const creditTotal = credits?.sum || 0;
    const debitTotal = debits?.sum || 0;
    return creditTotal - debitTotal;
  }

  /**
   * Get comprehensive financial ledger summary
   */
  static async getSummary(): Promise<LedgerSummary> {
    const balance = await LedgerService.getCurrentBalance();

    const creditRow = await DB.get<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM ledger_entries WHERE entry_type = 'CREDIT'`
    );
    const debitRow = await DB.get<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM ledger_entries WHERE entry_type = 'DEBIT'`
    );
    const refundRow = await DB.get<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM ledger_entries WHERE related_entity_type = 'REFUND'`
    );

    const pendingColRow = await DB.get<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM contributions WHERE status IN ('PENDING', 'SUBMITTED', 'VERIFICATION_REQUIRED')`
    );
    const pendingExpRow = await DB.get<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE approval_status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED')`
    );
    const countRow = await DB.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM ledger_entries`
    );

    return {
      openingBalance: 0,
      totalVerifiedContributions: creditRow?.total || 0,
      totalVerifiedIncome: creditRow?.total || 0,
      totalPaidExpenses: debitRow?.total || 0,
      totalApprovedRefunds: refundRow?.total || 0,
      currentAvailableBalance: balance,
      pendingCollections: pendingColRow?.total || 0,
      pendingExpenses: pendingExpRow?.total || 0,
      totalEntriesCount: countRow?.count || 0
    };
  }

  /**
   * Post a Credit to Ledger for a Verified Contribution
   */
  static async postContributionCredit(
    contributionId: string,
    amount: number,
    campaignId: string,
    referenceNo: string,
    description: string,
    actor?: AuthUser
  ): Promise<string> {
    // Check if duplicate entry already exists for this contribution
    const existing = await DB.get(
      `SELECT id FROM ledger_entries WHERE related_entity_type = 'CONTRIBUTION' AND related_entity_id = ?`,
      [contributionId]
    );

    if (existing) {
      throw new Error(`Ledger entry already exists for contribution ID ${contributionId}`);
    }

    const currentBalance = await LedgerService.getCurrentBalance();
    const newBalance = currentBalance + amount;
    const entryId = `led-${uuidv4().substring(0, 8)}`;
    const txnRef = `TXN-CON-${Date.now().toString().slice(-6)}`;

    await DB.run(
      `INSERT INTO ledger_entries (
        id, transaction_ref, entry_type, amount, category, campaign_id,
        related_entity_type, related_entity_id, balance_after, description,
        actor_id, created_at
      ) VALUES (?, ?, 'CREDIT', ?, 'CONTRIBUTION', ?, 'CONTRIBUTION', ?, ?, ?, ?, datetime('now'))`,
      [
        entryId,
        txnRef,
        amount,
        campaignId,
        contributionId,
        newBalance,
        description,
        actor?.id || null
      ]
    );

    return entryId;
  }

  /**
   * Post a Debit to Ledger for a Paid Expense
   */
  static async postExpenseDebit(
    expenseId: string,
    amount: number,
    category: string,
    campaignId: string | null,
    referenceNo: string,
    description: string,
    actor?: AuthUser
  ): Promise<string> {
    // Check if duplicate entry already exists for this expense
    const existing = await DB.get(
      `SELECT id FROM ledger_entries WHERE related_entity_type = 'EXPENSE' AND related_entity_id = ?`,
      [expenseId]
    );

    if (existing) {
      throw new Error(`Ledger entry already exists for expense ID ${expenseId}`);
    }

    const currentBalance = await LedgerService.getCurrentBalance();
    if (currentBalance < amount) {
      throw new Error(`Insufficient available funds. Current balance is ₹${currentBalance}, but expense requires ₹${amount}.`);
    }

    const newBalance = currentBalance - amount;
    const entryId = `led-${uuidv4().substring(0, 8)}`;
    const txnRef = `TXN-EXP-${Date.now().toString().slice(-6)}`;

    await DB.run(
      `INSERT INTO ledger_entries (
        id, transaction_ref, entry_type, amount, category, campaign_id,
        related_entity_type, related_entity_id, balance_after, description,
        actor_id, created_at
      ) VALUES (?, ?, 'DEBIT', ?, ?, ?, 'EXPENSE', ?, ?, ?, ?, datetime('now'))`,
      [
        entryId,
        txnRef,
        amount,
        category,
        campaignId,
        expenseId,
        newBalance,
        description,
        actor?.id || null
      ]
    );

    return entryId;
  }

  /**
   * Post Reversal or Adjustment (Rule 2: Corrections require an adjustment/reversal record)
   */
  static async postAdjustment(
    originalEntityId: string,
    entityType: 'CONTRIBUTION' | 'EXPENSE',
    adjustmentType: 'ADJUSTMENT_CREDIT' | 'ADJUSTMENT_DEBIT',
    amount: number,
    reason: string,
    actor: AuthUser
  ): Promise<string> {
    const currentBalance = await LedgerService.getCurrentBalance();
    const newBalance =
      adjustmentType === 'ADJUSTMENT_CREDIT'
        ? currentBalance + amount
        : currentBalance - amount;

    if (adjustmentType === 'ADJUSTMENT_DEBIT' && newBalance < 0) {
      throw new Error(`Adjustment would cause negative balance (Current: ₹${currentBalance}, Requested Debit: ₹${amount})`);
    }

    const entryId = `led-adj-${uuidv4().substring(0, 8)}`;
    const txnRef = `TXN-ADJ-${Date.now().toString().slice(-6)}`;

    await DB.run(
      `INSERT INTO ledger_entries (
        id, transaction_ref, entry_type, amount, category, related_entity_type,
        related_entity_id, balance_after, description, actor_id, created_at
      ) VALUES (?, ?, ?, ?, 'ADJUSTMENT', ?, ?, ?, ?, ?, datetime('now'))`,
      [
        entryId,
        txnRef,
        adjustmentType,
        amount,
        entityType,
        originalEntityId,
        newBalance,
        `Adjustment/Correction: ${reason}`,
        actor.id
      ]
    );

    await logAudit({
      user: actor,
      action: 'LEDGER_ADJUSTMENT_POSTED',
      entityType: 'LEDGER_ENTRY',
      entityId: entryId,
      newValue: {
        adjustmentType,
        amount,
        reason,
        balanceAfter: newBalance,
        originalEntityId
      }
    });

    return entryId;
  }
}
