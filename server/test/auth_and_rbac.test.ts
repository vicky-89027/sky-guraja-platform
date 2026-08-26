import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { DB } from '../src/db/database';
import { seedDatabase } from '../src/db/seeds';
import { generateToken, AuthUser } from '../src/middleware/auth';

describe('AUTHENTICATION & RBAC SECURITY TEST SUITE', () => {
  beforeAll(async () => {
    await seedDatabase();
  });

  it('AUTH-01: Registers a new member account with password hashing', async () => {
    const uniquePhone = `9848${Math.floor(100000 + Math.random() * 900000)}`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'B. Jagadeesh Yadav',
        phone: uniquePhone,
        email: `jagadeesh.${uniquePhone}@skyguraja.org`,
        username: `jagadeesh_${uniquePhone}`,
        password: 'SRIKRISHNA26',
        village: 'Guraja',
        memberType: 'Youth Member'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.fullName).toBe('B. Jagadeesh Yadav');
    expect(res.body.user.role).toBe('MEMBER');

    // Verify in database that password is not in plaintext
    const dbUser = await DB.get<any>(`SELECT * FROM users WHERE phone = ?`, [uniquePhone]);
    expect(dbUser).toBeDefined();
    expect(dbUser.password_hash).not.toBe('SRIKRISHNA26');
    expect(dbUser.password_hash.startsWith('$2')).toBe(true); // bcrypt hash
  });

  it('AUTH-02: Rejects registration with duplicate phone number', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Duplicate User',
        phone: '9848011111', // admin's phone
        password: 'SRIKRISHNA26'
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('AUTH-03: Rejects registration with invalid phone or missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Incomplete User',
        phone: '123', // invalid phone
        password: 'SRIKRISHNA26'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('AUTH-04: Successfully authenticates valid credentials and returns JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'admin',
        password: 'SRIKRISHNA26'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('SUPER_ADMIN');
  });

  it('AUTH-05: Rejects login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'admin',
        password: 'WrongPassword@123'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('RBAC-01: Rejects unauthenticated access to protected routes', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('RBAC-02: Enforces strict READ-ONLY for AUDITOR role (prevents mutation)', async () => {
    const auditorUser: AuthUser = {
      id: 'usr-auditor-01',
      username: 'auditor',
      email: 'auditor@skyguraja.org',
      role: 'AUDITOR',
      fullName: 'G Phani Kumar Yadav'
    };
    const auditorToken = generateToken(auditorUser);

    // Auditor can read
    const readRes = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(readRes.status).toBe(200);

    // Auditor CANNOT create or mutate
    const mutateRes = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${auditorToken}`)
      .send({
        amount: 500,
        category: 'TEST',
        description: 'Auditor attempt'
      });
    expect(mutateRes.status).toBe(403);
  });

  it('RBAC-03: Allows SUPER_ADMIN universal access to administrative routes', async () => {
    const adminUser: AuthUser = {
      id: 'usr-admin-01',
      username: 'admin',
      email: 'admin@skyguraja.org',
      role: 'SUPER_ADMIN',
      fullName: 'S Ganesh Yadav'
    };
    const adminToken = generateToken(adminUser);

    const res = await request(app)
      .get('/api/settings')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
