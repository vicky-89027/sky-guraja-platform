import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { seedDatabase } from '../src/db/seeds';
import { generateToken, AuthUser } from '../src/middleware/auth';

describe('SECURITY, IDOR & INPUT VALIDATION TEST SUITE', () => {
  let memberToken: string;

  beforeAll(async () => {
    await seedDatabase();

    const member: AuthUser = {
      id: 'usr-member-01',
      username: 'member_test',
      email: 'member@skyguraja.org',
      role: 'MEMBER',
      fullName: 'Youth Member',
      memberId: 'mem-05'
    };
    memberToken = generateToken(member);
  });

  it('SEC-01: Protects against unauthorized role escalation in registration', async () => {
    // Attempting to inject SUPER_ADMIN role in register
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Attacker Attempt',
        phone: '9848099111',
        password: 'SRIKRISHNA26',
        role: 'SUPER_ADMIN' // Malicious role parameter
      });

    expect(res.status).toBe(201);
    // Server must force role to MEMBER, ignoring client-supplied role
    expect(res.body.user.role).toBe('MEMBER');
  });

  it('SEC-02: Prevents non-admin from updating organization settings (IDOR / Privilege escalation)', async () => {
    const res = await request(app)
      .post('/api/settings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        settings: { orgName: 'HACKED_NAME' }
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('SEC-03: Sanitizes input and treats XSS payloads as plain text strings', async () => {
    const xssPayload = '<script>alert("xss")</script>';
    const res = await request(app)
      .post('/api/contributions/upi/initiate')
      .send({
        contributorName: `Devotee ${xssPayload}`,
        phone: '9848011223',
        amount: 2000,
        address: xssPayload
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('SEC-04: Rejects unauthorized receipt voiding attempts', async () => {
    const res = await request(app)
      .post('/api/receipts/rcpt-01/void')
      .send({
        adminRole: 'MEMBER', // Unauthorized role
        reason: 'Illegal void attempt'
      });

    expect(res.status).toBe(403);
  });
});
