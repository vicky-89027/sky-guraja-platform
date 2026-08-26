import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { seedDatabase } from '../src/db/seeds';

describe('DIGITAL RECEIPTS & QR CODE VERIFICATION TEST SUITE', () => {
  beforeAll(async () => {
    await seedDatabase();
  });

  it('QR-01: Verifies an authentic E-Receipt by verification token with privacy masking', async () => {
    // 1. Create and verify a contribution
    const initRes = await request(app)
      .post('/api/contributions/upi/initiate')
      .send({
        contributorName: 'K. Subrahmanyam Yadav',
        phone: '9849112233',
        email: 'k.subbu@yahoo.com',
        amount: 25000,
        campaignTitle: 'Village Seva Fund'
      });
    const contributionId = initRes.body.contributionId;

    const verifyRes = await request(app)
      .post('/api/contributions/upi/verify')
      .send({ contributionId });

    const verificationToken = verifyRes.body.receipt.verificationToken;
    expect(verificationToken).toBeDefined();

    // 2. Scan and verify QR token
    const qrRes = await request(app).get(`/api/receipts/verify/${verificationToken}`);

    expect(qrRes.status).toBe(200);
    expect(qrRes.body.valid).toBe(true);
    expect(qrRes.body.status).toBe('VERIFIED');
    expect(qrRes.body.contributorName).toBe('K. Subrahmanyam Yadav');
    expect(qrRes.body.amount).toBe(25000);

    // 3. Privacy Masking: Check that raw phone and email are NOT exposed in public QR verification
    expect(qrRes.body.maskedPhone).toBe('******2233');
    expect(qrRes.body.maskedEmail).toBe('k***@yahoo.com');
  });

  it('QR-02: Returns NOT_FOUND for invalid or forged verification token', async () => {
    const res = await request(app).get('/api/receipts/verify/FORGED-TOKEN-999');
    expect(res.status).toBe(404);
    expect(res.body.valid).toBe(false);
    expect(res.body.status).toBe('NOT_FOUND');
  });

  it('QR-03: Handles officially VOIDED receipts correctly', async () => {
    // 1. Create a receipt
    const initRes = await request(app)
      .post('/api/contributions/upi/initiate')
      .send({
        contributorName: 'Test Void Donor',
        phone: '9848011223',
        amount: 3000
      });
    const verifyRes = await request(app)
      .post('/api/contributions/upi/verify')
      .send({ contributionId: initRes.body.contributionId });

    const receiptId = verifyRes.body.receipt.id;
    const token = verifyRes.body.receipt.verificationToken;

    // 2. Void the receipt as Admin
    const voidRes = await request(app)
      .post(`/api/receipts/${receiptId}/void`)
      .send({
        adminRole: 'ADMIN',
        reason: 'Payment reversed by bank chargeback'
      });
    expect(voidRes.status).toBe(200);
    expect(voidRes.body.success).toBe(true);

    // 3. Scan QR token of the voided receipt
    const qrRes = await request(app).get(`/api/receipts/verify/${token}`);
    expect(qrRes.body.valid).toBe(false);
    expect(qrRes.body.status).toBe('VOIDED');
    expect(qrRes.body.message).toContain('VOIDE');
  });
});
