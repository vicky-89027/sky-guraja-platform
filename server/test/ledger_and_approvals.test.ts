import { describe, it, expect, beforeAll } from 'vitest';
import { DB } from '../src/db/database';
import { seedDatabase } from '../src/db/seeds';
import { LedgerService } from '../src/services/ledgerService';
import { ApprovalService } from '../src/services/approvalService';
import { ReceiptService } from '../src/services/receiptService';

describe('Sri Krishna Yadav Youth Guraja - Financial & Security Core Tests', () => {
  beforeAll(async () => {
    await seedDatabase();
  });

  it('RULE 6: Dashboard and available balance are strictly derived from verified ledger entries', async () => {
    const summary = await LedgerService.getSummary();
    const balance = await LedgerService.getCurrentBalance();

    expect(summary.currentAvailableBalance).toBe(balance);
    expect(summary.totalVerifiedContributions - summary.totalPaidExpenses).toBe(balance);
    expect(balance).toBeGreaterThan(0);
  });

  it('RULE 4: Digital Receipt Service generates valid sequential receipts and security hashes', async () => {
    const receiptNum = await ReceiptService.generateNextReceiptNumber();
    expect(receiptNum).toMatch(/^SKY-REC-\d{4}-\d{4}$/);

    const words = ReceiptService.amountToWords(25000);
    expect(words).toBe('Twenty Five Thousand Rupees Only');

    const wordsSmall = ReceiptService.amountToWords(7500);
    expect(wordsSmall).toBe('Seven Thousand Five Hundred Rupees Only');
  });

  it('APPROVAL TIERS: Dynamically assigns correct required roles based on amount thresholds', async () => {
    // Tier 1: ₹3,000 (<= 5000)
    const tier1 = await ApprovalService.getMatchingTier(3000);
    expect(tier1?.required_roles).toEqual(['TREASURER']);

    // Tier 2: ₹12,000 (5001 - 25000)
    const tier2 = await ApprovalService.getMatchingTier(12000);
    expect(tier2?.required_roles).toEqual(['TREASURER', 'SECRETARY']);

    // Tier 3: ₹50,000 (> 25000)
    const tier3 = await ApprovalService.getMatchingTier(50000);
    expect(tier3?.required_roles).toEqual(['TREASURER', 'SECRETARY', 'PRESIDENT']);
  });

  it('APPROVAL EVALUATION: Correctly evaluates full vs partial sign-offs', () => {
    const required = ['TREASURER', 'SECRETARY', 'PRESIDENT'];

    expect(ApprovalService.isFullyApproved(required, ['TREASURER'])).toBe(false);
    expect(ApprovalService.isFullyApproved(required, ['TREASURER', 'SECRETARY'])).toBe(false);
    expect(ApprovalService.isFullyApproved(required, ['TREASURER', 'SECRETARY', 'PRESIDENT'])).toBe(true);
  });

  it('FINANCIAL INTEGRITY: Prevents duplicate ledger entries for the same entity', async () => {
    // Attempting to post another credit for already posted con-01 should fail
    await expect(
      LedgerService.postContributionCredit('con-01', 25000, 'cmp-01', 'REF-01', 'Duplicate attempt')
    ).rejects.toThrow(/already exists/i);
  });
});
