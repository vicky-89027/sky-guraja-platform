import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { DB } from './database';
import { initSchema } from './schema';

export async function seedDatabase(): Promise<void> {
  await initSchema();

  const existingUsers = await DB.query('SELECT COUNT(*) as count FROM users');
  if (existingUsers[0]?.count > 0) {
    return; // Already seeded
  }

  console.log('Seeding Sri Krishna Yadav Youth Guraja database...');

  const passwordHash = await bcrypt.hash('SkyGuraja@2026', 10);

  // 1. Create Organization Settings
  const settings = [
    { key: 'org_name', value: 'Sri Krishna Yadav Youth Guraja' },
    { key: 'org_monogram', value: 'SKY' },
    { key: 'org_tagline', value: 'Unity • Culture • Community Service • Progress' },
    { key: 'org_address', value: 'Yadav Youth Bhavan, Main Road, Guraja, Krishna District, AP - 521321' },
    { key: 'org_email', value: 'contact@skyguraja.org' },
    { key: 'org_phone', value: '+91 98480 22334' },
    { key: 'currency_symbol', value: '₹' },
    { key: 'receipt_prefix', value: 'SKY-REC' },
    { key: 'public_transparency_enabled', value: 'true' },
    { key: 'public_donor_names_visible', value: 'true' }
  ];

  for (const s of settings) {
    await DB.run('INSERT INTO organization_settings (key, value, updated_at) VALUES (?, ?, datetime("now"))', [s.key, s.value]);
  }

  // 2. Create Users
  const users = [
    {
      id: 'usr-admin-01',
      username: 'admin',
      email: 'admin@skyguraja.org',
      phone: '9848011111',
      full_name: 'Venkata Krishna Yadav',
      role: 'SUPER_ADMIN'
    },
    {
      id: 'usr-pres-01',
      username: 'president',
      email: 'president@skyguraja.org',
      phone: '9848022222',
      full_name: 'Nagaraju Yadav',
      role: 'PRESIDENT'
    },
    {
      id: 'usr-sec-01',
      username: 'secretary',
      email: 'secretary@skyguraja.org',
      phone: '9848033333',
      full_name: 'Suresh Kumar Yadav',
      role: 'SECRETARY'
    },
    {
      id: 'usr-tres-01',
      username: 'treasurer',
      email: 'treasurer@skyguraja.org',
      phone: '9848044444',
      full_name: 'Ramesh Yadav',
      role: 'TREASURER'
    },
    {
      id: 'usr-mem-01',
      username: 'member',
      email: 'member@skyguraja.org',
      phone: '9848055555',
      full_name: 'Pavan Kalyan Yadav',
      role: 'MEMBER'
    },
    {
      id: 'usr-audit-01',
      username: 'auditor',
      email: 'auditor@skyguraja.org',
      phone: '9848066666',
      full_name: 'G. V. R. Prasad (CA)',
      role: 'AUDITOR'
    }
  ];

  for (const u of users) {
    await DB.run(
      `INSERT INTO users (id, username, email, phone, password_hash, full_name, role, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      [u.id, u.username, u.email, u.phone, passwordHash, u.full_name, u.role]
    );
  }

  // 3. Create Committee Members
  const members = [
    {
      id: 'mem-01',
      user_id: 'usr-pres-01',
      name: 'Nagaraju Yadav',
      role_title: 'President',
      phone: '9848022222',
      email: 'president@skyguraja.org',
      joining_date: '2022-01-15',
      area_location: 'Guraja Center',
      assigned_responsibilities: 'Overall Leadership, External Affairs & Policy'
    },
    {
      id: 'mem-02',
      user_id: 'usr-sec-01',
      name: 'Suresh Kumar Yadav',
      role_title: 'General Secretary',
      phone: '9848033333',
      email: 'secretary@skyguraja.org',
      joining_date: '2022-01-15',
      area_location: 'Guraja North',
      assigned_responsibilities: 'Meetings, Minutes, Membership & Public Relations'
    },
    {
      id: 'mem-03',
      user_id: 'usr-tres-01',
      name: 'Ramesh Yadav',
      role_title: 'Treasurer',
      phone: '9848044444',
      email: 'treasurer@skyguraja.org',
      joining_date: '2022-01-15',
      area_location: 'Guraja South',
      assigned_responsibilities: 'Fund Management, Collections, Ledger, Financial Audits'
    },
    {
      id: 'mem-04',
      user_id: 'usr-mem-01',
      name: 'Pavan Kalyan Yadav',
      role_title: 'Youth Coordinator',
      phone: '9848055555',
      email: 'member@skyguraja.org',
      joining_date: '2023-04-10',
      area_location: 'Guraja East',
      assigned_responsibilities: 'Volunteer Coordination & Event Logistics'
    },
    {
      id: 'mem-05',
      user_id: null,
      name: 'Anil Yadav',
      role_title: 'Sports In-charge',
      phone: '9848077777',
      email: 'anil.yadav@skyguraja.org',
      joining_date: '2023-08-01',
      area_location: 'Guraja West',
      assigned_responsibilities: 'Youth Sports Tournaments & Ground Management'
    },
    {
      id: 'mem-06',
      user_id: null,
      name: 'Koteswara Rao Yadav',
      role_title: 'Cultural Secretary',
      phone: '9848088888',
      email: 'koti.yadav@skyguraja.org',
      joining_date: '2022-05-20',
      area_location: 'Guraja Temple Street',
      assigned_responsibilities: 'Festivals, Cultural Stage & Stage Programs'
    }
  ];

  for (const m of members) {
    await DB.run(
      `INSERT INTO committee_members (id, user_id, name, role_title, phone, email, joining_date, area_location, active, assigned_responsibilities, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, datetime('now'))`,
      [m.id, m.user_id, m.name, m.role_title, m.phone, m.email, m.joining_date, m.area_location, m.assigned_responsibilities]
    );
  }

  // 4. Create Approval Thresholds (Configurable Multi-Tier)
  const thresholds = [
    {
      id: 'tier-01',
      tier_name: 'Minor Expense Tier (₹0 - ₹5,000)',
      min_amount: 0,
      max_amount: 5000,
      required_roles_json: JSON.stringify(['TREASURER'])
    },
    {
      id: 'tier-02',
      tier_name: 'Medium Expense Tier (₹5,001 - ₹25,000)',
      min_amount: 5001,
      max_amount: 25000,
      required_roles_json: JSON.stringify(['TREASURER', 'SECRETARY'])
    },
    {
      id: 'tier-03',
      tier_name: 'Major Expense Tier (Above ₹25,000)',
      min_amount: 25001,
      max_amount: null,
      required_roles_json: JSON.stringify(['TREASURER', 'SECRETARY', 'PRESIDENT'])
    }
  ];

  for (const t of thresholds) {
    await DB.run(
      `INSERT INTO approval_thresholds (id, tier_name, min_amount, max_amount, required_roles_json, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, 1, datetime('now'))`,
      [t.id, t.tier_name, t.min_amount, t.max_amount, t.required_roles_json]
    );
  }

  // 5. Create Campaigns
  const campaigns = [
    {
      id: 'cmp-01',
      name: 'Sri Krishna Janmashtami 2026 Grand Celebration',
      description: 'Annual village grand festival with Annadanam, cultural stage programs, Utlotsavam (Dahi Handi), and youth awards.',
      target_amount: 250000,
      start_date: '2026-07-01',
      end_date: '2026-09-10',
      category: 'FESTIVAL',
      organizer_id: 'mem-06',
      status: 'ACTIVE',
      is_public: 1
    },
    {
      id: 'cmp-02',
      name: 'Youth Community Study Hall & Digital Library',
      description: 'Setting up high-speed internet, competitive exam books, computers, and desks for Guraja students & aspirants.',
      target_amount: 150000,
      start_date: '2026-05-01',
      end_date: '2026-11-30',
      category: 'COMMUNITY_DEVELOPMENT',
      organizer_id: 'mem-04',
      status: 'ACTIVE',
      is_public: 1
    },
    {
      id: 'cmp-03',
      name: 'Guraja Clean Drinking Water Plant Maintenance',
      description: 'Replacement of RO membranes, filter media, and annual service for the public drinking water kiosk.',
      target_amount: 50000,
      start_date: '2026-03-01',
      end_date: '2026-06-30',
      category: 'COMMUNITY_SERVICE',
      organizer_id: 'mem-03',
      status: 'COMPLETED',
      is_public: 1
    },
    {
      id: 'cmp-04',
      name: 'Emergency Medical & Education Aid Fund',
      description: 'Continuous reserve fund for village families needing urgent medical assistance or poor student fees.',
      target_amount: 100000,
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      category: 'EMERGENCY_AID',
      organizer_id: 'mem-01',
      status: 'ACTIVE',
      is_public: 1
    }
  ];

  for (const c of campaigns) {
    await DB.run(
      `INSERT INTO campaigns (id, name, description, target_amount, start_date, end_date, category, organizer_id, status, is_public, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [c.id, c.name, c.description, c.target_amount, c.start_date, c.end_date, c.category, c.organizer_id, c.status, c.is_public]
    );
  }

  // 6. Member Collection Assignments
  const assignments = [
    { id: 'asg-01', campaign_id: 'cmp-01', member_id: 'mem-04', target: 50000 },
    { id: 'asg-02', campaign_id: 'cmp-01', member_id: 'mem-05', target: 40000 },
    { id: 'asg-03', campaign_id: 'cmp-01', member_id: 'mem-06', target: 60000 },
    { id: 'asg-04', campaign_id: 'cmp-02', member_id: 'mem-04', target: 40000 }
  ];

  for (const a of assignments) {
    await DB.run(
      `INSERT INTO collection_assignments (id, campaign_id, member_id, target_amount, status, assigned_at, updated_at)
       VALUES (?, ?, ?, ?, 'IN_PROGRESS', datetime('now'), datetime('now'))`,
      [a.id, a.campaign_id, a.member_id, a.target]
    );
  }

  // 7. Seed Initial Verified Contributions & Generate Receipts & Ledger Entries
  let runningBalance = 0;

  const contributionsData = [
    {
      id: 'con-01',
      receipt_num: 'SKY-REC-2026-001',
      donor_name: 'M. Venkateswara Rao',
      phone: '9988776655',
      email: 'm.venkat@gmail.com',
      amount: 25000,
      date: '2026-07-05',
      campaign_id: 'cmp-01',
      purpose: 'Sri Krishna Janmashtami Main Sponsor',
      payment_method: 'UPI',
      reference_no: 'UPI/260705/889211',
      collector_id: 'mem-04',
      collector_name: 'Pavan Kalyan Yadav',
      status: 'VERIFIED'
    },
    {
      id: 'con-02',
      receipt_num: 'SKY-REC-2026-002',
      donor_name: 'K. Subrahmanyam Yadav',
      phone: '9849112233',
      email: 'k.subbu@yahoo.com',
      amount: 15000,
      date: '2026-07-08',
      campaign_id: 'cmp-01',
      purpose: 'Annadanam Seva Contribution',
      payment_method: 'BANK_TRANSFER',
      reference_no: 'NEFT/HDFC/992144',
      collector_id: 'mem-03',
      collector_name: 'Ramesh Yadav',
      status: 'VERIFIED'
    },
    {
      id: 'con-03',
      receipt_num: 'SKY-REC-2026-003',
      donor_name: 'B. Jagadeesh & Brothers',
      phone: '9440123456',
      email: 'jagadeesh.b@gmail.com',
      amount: 10000,
      date: '2026-07-12',
      campaign_id: 'cmp-01',
      purpose: 'Prasadam & Flower Decoration',
      payment_method: 'CASH',
      reference_no: 'CASH-REC-03',
      collector_id: 'mem-04',
      collector_name: 'Pavan Kalyan Yadav',
      status: 'VERIFIED'
    },
    {
      id: 'con-04',
      receipt_num: 'SKY-REC-2026-004',
      donor_name: 'T. Rama Krishna',
      phone: '9876543210',
      email: 'tramak@outlook.com',
      amount: 30000,
      date: '2026-05-15',
      campaign_id: 'cmp-02',
      purpose: 'Study Hall Computers Donation',
      payment_method: 'UPI',
      reference_no: 'UPI/260515/776211',
      collector_id: 'mem-04',
      collector_name: 'Pavan Kalyan Yadav',
      status: 'VERIFIED'
    },
    {
      id: 'con-05',
      receipt_num: 'SKY-REC-2026-005',
      donor_name: 'Guraja NRI Association (USA)',
      phone: '9848099887',
      email: 'nri.guraja@gmail.com',
      amount: 50000,
      date: '2026-03-10',
      campaign_id: 'cmp-03',
      purpose: 'RO Water Plant Full Overhaul Sponsorship',
      payment_method: 'BANK_TRANSFER',
      reference_no: 'WIRE/ICICI/110943',
      collector_id: 'mem-01',
      collector_name: 'Nagaraju Yadav',
      status: 'VERIFIED'
    },
    {
      id: 'con-06',
      receipt_num: 'SKY-REC-2026-006',
      donor_name: 'G. Harish Yadav',
      phone: '9123456780',
      email: 'harish.y@gmail.com',
      amount: 5000,
      date: '2026-07-20',
      campaign_id: 'cmp-01',
      purpose: 'Utlotsavam Youth Trophy Sponsor',
      payment_method: 'UPI',
      reference_no: 'UPI/260720/334455',
      collector_id: 'mem-05',
      collector_name: 'Anil Yadav',
      status: 'SUBMITTED' // Pending verification
    }
  ];

  for (const c of contributionsData) {
    const receiptId = `rec-${uuidv4().substring(0, 8)}`;
    await DB.run(
      `INSERT INTO contributions (id, receipt_id, donor_name, phone, email, amount, date, campaign_id, purpose, payment_method, reference_no, collected_by_id, status, verified_by_id, verified_at, is_public, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      [
        c.id,
        c.status === 'VERIFIED' ? receiptId : null,
        c.donor_name,
        c.phone,
        c.email,
        c.amount,
        c.date,
        c.campaign_id,
        c.purpose,
        c.payment_method,
        c.reference_no,
        c.collector_id,
        c.status,
        c.status === 'VERIFIED' ? 'usr-tres-01' : null,
        c.status === 'VERIFIED' ? c.date : null
      ]
    );

    if (c.status === 'VERIFIED') {
      runningBalance += c.amount;

      // Create Receipt Record
      const qrData = JSON.stringify({
        receipt: c.receipt_num,
        org: 'SKY GURAJA',
        donor: c.donor_name,
        amount: c.amount,
        date: c.date,
        v: 1
      });
      const hash = `HASH-${uuidv4().substring(0, 12).toUpperCase()}`;

      await DB.run(
        `INSERT INTO receipts (id, receipt_number, contribution_id, donor_name, amount, date, campaign_name, payment_method, reference_no, collector_name, verification_status, qr_code_data, security_hash, issued_at)
         VALUES (?, ?, ?, ?, ?, ?, (SELECT name FROM campaigns WHERE id = ?), ?, ?, ?, 'VERIFIED', ?, ?, datetime('now'))`,
        [
          receiptId,
          c.receipt_num,
          c.id,
          c.donor_name,
          c.amount,
          c.date,
          c.campaign_id,
          c.payment_method,
          c.reference_no,
          c.collector_name,
          qrData,
          hash
        ]
      );

      // Ledger Entry (Credit)
      await DB.run(
        `INSERT INTO ledger_entries (id, transaction_ref, entry_type, amount, category, campaign_id, related_entity_type, related_entity_id, balance_after, description, actor_id, created_at)
         VALUES (?, ?, 'CREDIT', ?, 'CONTRIBUTION', ?, 'CONTRIBUTION', ?, ?, ?, 'usr-tres-01', ?)`,
        [
          `TXN-${c.receipt_num}`,
          `REF-${c.receipt_num}`,
          c.amount,
          c.campaign_id,
          c.id,
          runningBalance,
          `Contribution from ${c.donor_name} for ${c.purpose}`,
          `${c.date} 10:00:00`
        ]
      );
    }
  }

  // 8. Seed Verified / Approved Expenses & Ledger Entries
  const expensesData = [
    {
      id: 'exp-01',
      amount: 38000,
      category: 'COMMUNITY_SERVICE',
      description: 'RO Membrane replacement, high-pressure pump service and filter piping',
      campaign_id: 'cmp-03',
      requested_by: 'mem-03',
      date: '2026-03-25',
      vendor: 'Sri Balaji Water Solutions, Vijayawada',
      payment_method: 'BANK_TRANSFER',
      status: 'PAID',
      approvals: ['TREASURER', 'SECRETARY', 'PRESIDENT']
    },
    {
      id: 'exp-02',
      amount: 4500,
      category: 'PRINTING',
      description: 'Printing 2,000 invitation cards and banner flex prints for Janmashtami',
      campaign_id: 'cmp-01',
      requested_by: 'mem-04',
      date: '2026-07-15',
      vendor: 'Surya Graphics & Offset Printers, Gudivada',
      payment_method: 'UPI',
      status: 'PAID',
      approvals: ['TREASURER']
    },
    {
      id: 'exp-03',
      amount: 18000,
      category: 'EQUIPMENT',
      description: 'Advance payment for stage lighting, sound system, and traditional generator setup',
      campaign_id: 'cmp-01',
      requested_by: 'mem-06',
      date: '2026-07-22',
      vendor: 'Sri Sai Sounds & Lighting, Guraja',
      payment_method: 'BANK_TRANSFER',
      status: 'PAID',
      approvals: ['TREASURER', 'SECRETARY']
    },
    {
      id: 'exp-04',
      amount: 8500,
      category: 'FOOD',
      description: 'Initial provision purchase for Youth meeting dinner and volunteer refreshments',
      campaign_id: 'cmp-01',
      requested_by: 'mem-04',
      date: '2026-08-02',
      vendor: 'Sri Lakshmi Kirana & General Stores, Guraja',
      payment_method: 'UPI',
      status: 'UNDER_REVIEW',
      approvals: ['TREASURER']
    }
  ];

  for (const e of expensesData) {
    await DB.run(
      `INSERT INTO expenses (id, amount, category, description, campaign_id, requested_by_id, date, vendor_name, payment_method, approval_status, approved_by_roles_json, paid_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        e.id,
        e.amount,
        e.category,
        e.description,
        e.campaign_id,
        e.requested_by,
        e.date,
        e.vendor,
        e.payment_method,
        e.status,
        JSON.stringify(e.approvals),
        e.status === 'PAID' ? e.date : null
      ]
    );

    if (e.status === 'PAID') {
      runningBalance -= e.amount;

      // Ledger Entry (Debit)
      await DB.run(
        `INSERT INTO ledger_entries (id, transaction_ref, entry_type, amount, category, campaign_id, related_entity_type, related_entity_id, balance_after, description, actor_id, created_at)
         VALUES (?, ?, 'DEBIT', ?, ?, ?, 'EXPENSE', ?, ?, ?, 'usr-tres-01', ?)`,
        [
          `TXN-${e.id}`,
          `EXP-REF-${e.id}`,
          e.amount,
          e.category,
          e.campaign_id,
          e.id,
          runningBalance,
          `Paid ${e.amount} to ${e.vendor} for ${e.description}`,
          `${e.date} 14:30:00`
        ]
      );
    }
  }

  // 9. Seed Events
  const events = [
    {
      id: 'evt-01',
      name: 'Utlotsavam & Cultural Night 2026',
      description: 'Traditional pot-breaking festival with regional folk dances, bhajans, and felicitation of Guraja toppers.',
      event_date: '2026-09-04',
      event_time: '18:00',
      venue: 'Sri Krishna Temple Grounds, Guraja',
      coordinator_id: 'mem-06',
      budget: 85000,
      actual_expense: 22500,
      campaign_id: 'cmp-01',
      participants_count: 500,
      status: 'UPCOMING'
    },
    {
      id: 'evt-02',
      name: 'Free Mega Eye & General Health Camp',
      description: 'Free medical screening, eye checkup, and spectacles distribution in collaboration with Rotary & Lions Club.',
      event_date: '2026-06-14',
      event_time: '09:00',
      venue: 'Zilla Parishad High School, Guraja',
      coordinator_id: 'mem-04',
      budget: 20000,
      actual_expense: 18500,
      campaign_id: 'cmp-04',
      participants_count: 320,
      status: 'COMPLETED'
    }
  ];

  for (const ev of events) {
    await DB.run(
      `INSERT INTO events (id, name, description, event_date, event_time, venue, coordinator_id, budget, actual_expense, campaign_id, participants_count, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [ev.id, ev.name, ev.description, ev.event_date, ev.event_time, ev.venue, ev.coordinator_id, ev.budget, ev.actual_expense, ev.campaign_id, ev.participants_count, ev.status]
    );
  }

  // 10. Seed Meetings & Action Items
  const meetingId = 'mtg-01';
  await DB.run(
    `INSERT INTO meetings (id, title, meeting_date, location, agenda, decisions, created_by_id, created_at)
     VALUES (?, ?, '2026-07-01', 'SKY Youth Bhavan, Guraja',
     '1. Review of Janmashtami campaign collection progress\n2. Approval of vendor quotations for lighting & sound\n3. Volunteer mobilization per street',
     'Unanimously approved Sound vendor quotation of ₹35,000 max; Assigned Pavan Kalyan for youth volunteers.',
     'usr-sec-01', datetime('now'))`,
    [meetingId, 'Executive Committee Monthly Planning Meeting']
  );

  const actionItems = [
    {
      id: 'act-01',
      meeting_id: meetingId,
      title: 'Distribute collection receipt books to 5 area volunteers',
      description: 'Ensure each volunteer receives numbered books with SKY seal',
      assigned_to: 'mem-03',
      deadline: '2026-07-05',
      status: 'COMPLETED'
    },
    {
      id: 'act-02',
      meeting_id: meetingId,
      title: 'Finalize Stage and Lighting contract agreement',
      description: 'Obtain written quotation and advance receipt from vendor',
      assigned_to: 'mem-06',
      deadline: '2026-07-15',
      status: 'COMPLETED'
    },
    {
      id: 'act-03',
      meeting_id: meetingId,
      title: 'Police & Panchayat event permission letters submission',
      description: 'Submit NOC letter and route map for evening procession',
      assigned_to: 'mem-02',
      deadline: '2026-08-20',
      status: 'IN_PROGRESS'
    }
  ];

  for (const a of actionItems) {
    await DB.run(
      `INSERT INTO meeting_action_items (id, meeting_id, title, description, assigned_to_id, deadline, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [a.id, a.meeting_id, a.title, a.description, a.assigned_to, a.deadline, a.status]
    );
  }

  // 11. Seed Initial Audit Logs
  const auditLogs = [
    {
      id: 'aud-01',
      user_id: 'usr-admin-01',
      user_name: 'Venkata Krishna Yadav',
      user_role: 'SUPER_ADMIN',
      action: 'SYSTEM_INITIALIZED',
      entity_type: 'ORGANIZATION',
      entity_id: 'org-guraja',
      new_val: '{"status": "INITIALIZED", "org": "Sri Krishna Yadav Youth Guraja"}'
    },
    {
      id: 'aud-02',
      user_id: 'usr-tres-01',
      user_name: 'Ramesh Yadav',
      user_role: 'TREASURER',
      action: 'VERIFY_CONTRIBUTION',
      entity_type: 'CONTRIBUTION',
      entity_id: 'con-01',
      new_val: '{"donor": "M. Venkateswara Rao", "amount": 25000, "status": "VERIFIED"}'
    },
    {
      id: 'aud-03',
      user_id: 'usr-pres-01',
      user_name: 'Nagaraju Yadav',
      user_role: 'PRESIDENT',
      action: 'APPROVE_EXPENSE',
      entity_type: 'EXPENSE',
      entity_id: 'exp-01',
      new_val: '{"amount": 38000, "vendor": "Sri Balaji Water Solutions", "status": "APPROVED"}'
    }
  ];

  for (const l of auditLogs) {
    await DB.run(
      `INSERT INTO audit_logs (id, user_id, user_name, user_role, action, entity_type, entity_id, new_value_json, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, '127.0.0.1', datetime('now'))`,
      [l.id, l.user_id, l.user_name, l.user_role, l.action, l.entity_type, l.entity_id, l.new_val]
    );
  }

  console.log('Seed completed successfully. Running balance:', runningBalance);
}
