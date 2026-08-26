import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { seedDatabase } from '../src/db/seeds';
import { generateToken, AuthUser } from '../src/middleware/auth';

describe('EXPENSES & MULTI-TIER APPROVAL DISBURSEMENT TEST SUITE', () => {
  let treasurerToken: string;
  let secretaryToken: string;
  let presidentToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await seedDatabase();

    const treasurer: AuthUser = {
      id: 'usr-treasurer-01',
      username: 'treasurer',
      email: 'treasurer@skyguraja.org',
      role: 'TREASURER',
      fullName: 'Ramesh Yadav',
      memberId: 'mem-03'
    };
    treasurerToken = generateToken(treasurer);

    const secretary: AuthUser = {
      id: 'usr-secretary-01',
      username: 'secretary',
      email: 'secretary@skyguraja.org',
      role: 'SECRETARY',
      fullName: 'Suresh Kumar Yadav',
      memberId: 'mem-02'
    };
    secretaryToken = generateToken(secretary);

    const president: AuthUser = {
      id: 'usr-president-01',
      username: 'president',
      email: 'president@skyguraja.org',
      role: 'PRESIDENT',
      fullName: 'Nagaraju Yadav',
      memberId: 'mem-01'
    };
    presidentToken = generateToken(president);

    const admin: AuthUser = {
      id: 'usr-admin-01',
      username: 'admin',
      email: 'admin@skyguraja.org',
      role: 'SUPER_ADMIN',
      fullName: 'S Ganesh Yadav',
      memberId: 'mem-08'
    };
    adminToken = generateToken(admin);
  });

  it('EXP-01: Submits an expense request and assigns correct required roles for Tier 1 (<= ₹5,000)', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${treasurerToken}`)
      .send({
        amount: 3500,
        category: 'PUJA_ITEMS',
        description: 'Floral garlands and prasadam ingredients for Janmashtami',
        vendorName: 'Guraja Flower Mart'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.requiredTier.required_roles).toEqual(['TREASURER']);
  });

  it('EXP-02: Submits an expense request for Tier 2 (> ₹5,000 to ₹25,000) requiring Treasurer + Secretary', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${secretaryToken}`)
      .send({
        amount: 18000,
        category: 'SOUND_LIGHTING',
        description: 'Sound system and LED focus lights for Utsavam stage',
        vendorName: 'Sri Balaji Audio & Lights'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.requiredTier.required_roles).toEqual(['TREASURER', 'SECRETARY']);

    const expenseId = res.body.data.expenseId;

    // 1st Sign-off: Treasurer approves -> Status becomes UNDER_REVIEW (partial)
    const apr1 = await request(app)
      .post(`/api/expenses/${expenseId}/approve`)
      .set('Authorization', `Bearer ${treasurerToken}`)
      .send({ notes: 'Treasurer reviewed quotation' });

    expect(apr1.body.data.status).toBe('UNDER_REVIEW');
    expect(apr1.body.data.isFullyApproved).toBe(false);

    // 2nd Sign-off: Secretary approves -> Status becomes APPROVED (ready for payout)
    const apr2 = await request(app)
      .post(`/api/expenses/${expenseId}/approve`)
      .set('Authorization', `Bearer ${secretaryToken}`)
      .send({ notes: 'Secretary signed off' });

    expect(apr2.body.data.status).toBe('APPROVED');
    expect(apr2.body.data.isFullyApproved).toBe(true);

    // 3rd Step: Treasurer executes Payout -> Posts Debit to Ledger
    const payoutRes = await request(app)
      .post(`/api/expenses/${expenseId}/payout`)
      .set('Authorization', `Bearer ${treasurerToken}`);

    expect(payoutRes.status).toBe(200);
    expect(payoutRes.body.success).toBe(true);
    expect(payoutRes.body.ledgerEntryId).toBeDefined();
  });

  it('EXP-03: Prevents payout of an unapproved expense', async () => {
    // Create new expense
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${treasurerToken}`)
      .send({
        amount: 4000,
        category: 'PRINTING',
        description: 'Banner and flyer printing',
        vendorName: 'Sri Krishna Offset'
      });
    const expenseId = res.body.data.expenseId;

    // Attempt direct payout without approval
    const payoutRes = await request(app)
      .post(`/api/expenses/${expenseId}/payout`)
      .set('Authorization', `Bearer ${treasurerToken}`);

    expect(payoutRes.status).toBe(400);
    expect(payoutRes.body.message).toContain('Must be \'APPROVED\'');
  });
});
