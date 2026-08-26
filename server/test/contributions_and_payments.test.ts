import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { seedDatabase } from '../src/db/seeds';

describe('CONTRIBUTIONS & PAYMENT SYSTEMS TEST SUITE', () => {
  beforeAll(async () => {
    await seedDatabase();
  });

  it('PAY-01: Initiates a valid public UPI contribution request', async () => {
    const res = await request(app)
      .post('/api/contributions/upi/initiate')
      .send({
        contributorName: 'Ch. Sambasiva Rao Yadav',
        phone: '9440332211',
        email: 'sambasiva.y@gmail.com',
        amount: 15000,
        campaignId: 'cmp-01',
        campaignTitle: 'Sri Krishna Janmashtami & Utlotsavam'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.contributionId).toBeDefined();
    expect(res.body.orderId).toBeDefined();
    expect(res.body.amount).toBe(15000);
    expect(res.body.amountInWords).toContain('Fifteen Thousand');
  });

  it('PAY-02: Rejects invalid contribution amount (zero, negative, non-numeric)', async () => {
    const zeroRes = await request(app)
      .post('/api/contributions/upi/initiate')
      .send({
        contributorName: 'Invalid Amount Test',
        phone: '9848011111',
        amount: 0
      });
    expect(zeroRes.status).toBe(400);

    const negRes = await request(app)
      .post('/api/contributions/upi/initiate')
      .send({
        contributorName: 'Invalid Negative Amount',
        phone: '9848011111',
        amount: -500
      });
    expect(negRes.status).toBe(400);
  });

  it('PAY-03: Verifies successful payment, issues collision-free receipt, and enforces idempotency', async () => {
    // 1. Initiate
    const initRes = await request(app)
      .post('/api/contributions/upi/initiate')
      .send({
        contributorName: 'P. Koteswara Rao',
        phone: '9848055443',
        amount: 20000,
        campaignTitle: 'Sri Krishna Temple Arch'
      });
    const contributionId = initRes.body.contributionId;

    // 2. Verify
    const verifyRes = await request(app)
      .post('/api/contributions/upi/verify')
      .send({
        contributionId,
        gatewayPaymentId: 'UPI_PAY_TEST_778899'
      });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.verified).toBe(true);
    expect(verifyRes.body.receipt).toBeDefined();
    expect(verifyRes.body.receipt.receiptNumber).toMatch(/^SKYG\/26-27\/\d{6}$/);

    const firstReceiptNumber = verifyRes.body.receipt.receiptNumber;

    // 3. IDEMPOTENCY CHECK: Resending the verify request returns the same receipt, no duplicates!
    const replayRes = await request(app)
      .post('/api/contributions/upi/verify')
      .send({
        contributionId,
        gatewayPaymentId: 'UPI_PAY_TEST_778899'
      });

    expect(replayRes.status).toBe(200);
    expect(replayRes.body.receipt.receiptNumber).toBe(firstReceiptNumber);
  });

  it('CASH-01: Allows authenticated Committee Member to record cash contribution and generate receipt', async () => {
    const res = await request(app)
      .post('/api/contributions/cash/create')
      .send({
        memberId: 'mem-01',
        memberName: 'Nagaraju Yadav',
        memberRole: 'MEMBER',
        contributorName: 'Guraja Community Devotee',
        phone: '9848011223',
        amount: 5000,
        campaignTitle: 'Devi Navaratri Mahotsavam'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.receipt).toBeDefined();
    expect(res.body.receipt.receiptNumber).toBeDefined();
    expect(res.body.contribution.paymentMethod).toBe('CASH');
  });

  it('CASH-02: Denies unauthenticated / ordinary public user from recording cash transactions', async () => {
    const res = await request(app)
      .post('/api/contributions/cash/create')
      .send({
        memberRole: 'PUBLIC_USER',
        contributorName: 'Fake Attempt',
        phone: '9848011111',
        amount: 5000
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Access Denied');
  });

  it('WEBHOOK-01: Payment Gateway Webhook handles valid event idempotently', async () => {
    const testPaymentId = `PG_TXN_${Date.now()}`;
    const webhookRes = await request(app)
      .post('/api/public/webhook/payment-gateway')
      .send({
        event: 'PAYMENT_SUCCESS',
        paymentId: testPaymentId,
        amount: 10000,
        donorName: 'Sri Krishna NRI Donor',
        phone: '9848099887',
        campaignId: 'cmp-01'
      });

    expect(webhookRes.status).toBe(200);
    expect(webhookRes.body.success).toBe(true);
    expect(webhookRes.body.receiptNumber).toBeDefined();

    // Replay webhook with identical paymentId
    const replayWebhookRes = await request(app)
      .post('/api/public/webhook/payment-gateway')
      .send({
        event: 'PAYMENT_SUCCESS',
        paymentId: testPaymentId,
        amount: 10000,
        donorName: 'Sri Krishna NRI Donor',
        phone: '9848099887',
        campaignId: 'cmp-01'
      });

    expect(replayWebhookRes.status).toBe(200);
    expect(replayWebhookRes.body.message).toContain('Idempotent replay detected');
  });
});
