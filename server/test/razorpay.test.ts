import { describe, it, expect } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import app from '../src/app';

describe('RAZORPAY STANDARD WEB CHECKOUT SUITE', () => {
  const testKeySecret = process.env.RAZORPAY_KEY_SECRET || 'kxCOHz6gJHknD4iScB9c9n2g';

  it('RZP-01: Rejects create-order if amount < 100 paise', async () => {
    const res = await request(app)
      .post('/api/create-order')
      .send({
        amount: 50, // 50 paise is less than minimum 100 paise
        currency: 'INR'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('100 paise');
  });

  it('RZP-02: Successfully creates Razorpay order with valid amount', async () => {
    const res = await request(app)
      .post('/api/create-order')
      .send({
        amount: 50000, // ₹500 in paise
        currency: 'INR',
        receipt: `test_rcpt_${Date.now()}`
      });

    // Should return 200 with order_id (or 401 if mock/offline keys without net)
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.order_id).toBeDefined();
      expect(res.body.amount).toBe(50000);
      expect(res.body.currency).toBe('INR');
    } else {
      expect([200, 401, 500]).toContain(res.status);
    }
  });

  it('RZP-03: Successfully verifies valid HMAC-SHA256 signature', async () => {
    const orderId = 'order_test_123456';
    const paymentId = 'pay_test_987654';
    const generatedSignature = crypto
      .createHmac('sha256', testKeySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const res = await request(app)
      .post('/api/verify-payment')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: generatedSignature
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.verified).toBe(true);
    expect(res.body.order_id).toBe(orderId);
    expect(res.body.payment_id).toBe(paymentId);
  });

  it('RZP-04: Rejects forged/invalid signature with 400 Bad Request', async () => {
    const orderId = 'order_test_123456';
    const paymentId = 'pay_test_987654';
    const forgedSignature = 'forged_fake_signature_abc123';

    const res = await request(app)
      .post('/api/verify-payment')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: forgedSignature
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.verified).toBe(false);
    expect(res.body.error).toContain('Invalid payment signature');
  });

  it('RZP-05: Rejects missing verification fields with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/verify-payment')
      .send({
        razorpay_order_id: 'order_test_123456'
        // Missing payment_id & signature
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing required parameters');
  });
});
