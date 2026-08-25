import { DB } from './database';

export async function initSchema(): Promise<void> {
  const schemaSQL = `
    -- Users and Authentication
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('SUPER_ADMIN', 'PRESIDENT', 'SECRETARY', 'TREASURER', 'MEMBER', 'AUDITOR')),
      is_active INTEGER NOT NULL DEFAULT 1,
      last_login TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Committee Members Directory & Profile
    CREATE TABLE IF NOT EXISTS committee_members (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      role_title TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      joining_date TEXT NOT NULL,
      area_location TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      assigned_responsibilities TEXT,
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Fundraising Campaigns
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      target_amount REAL NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      category TEXT NOT NULL,
      banner_url TEXT,
      organizer_id TEXT REFERENCES committee_members(id),
      status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'COMPLETED', 'PAUSED', 'PLANNED')) DEFAULT 'ACTIVE',
      is_public INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Collection Assignments for Members
    CREATE TABLE IF NOT EXISTS collection_assignments (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      member_id TEXT NOT NULL REFERENCES committee_members(id) ON DELETE CASCADE,
      target_amount REAL NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('IN_PROGRESS', 'COMPLETED', 'REASSIGNED')) DEFAULT 'IN_PROGRESS',
      assigned_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(campaign_id, member_id)
    );

    -- Contributions / Donations
    CREATE TABLE IF NOT EXISTS contributions (
      id TEXT PRIMARY KEY,
      receipt_id TEXT UNIQUE,
      donor_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      amount REAL NOT NULL CHECK(amount > 0),
      date TEXT NOT NULL,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id),
      purpose TEXT NOT NULL,
      payment_method TEXT NOT NULL CHECK(payment_method IN ('CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'OTHER')),
      reference_no TEXT,
      collected_by_id TEXT REFERENCES committee_members(id),
      status TEXT NOT NULL CHECK(status IN (
        'PENDING', 'SUBMITTED', 'VERIFICATION_REQUIRED', 'VERIFIED',
        'REJECTED', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED'
      )) DEFAULT 'SUBMITTED',
      verified_by_id TEXT REFERENCES users(id),
      verified_at TEXT,
      notes TEXT,
      is_public INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Digital Receipts
    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      receipt_number TEXT UNIQUE NOT NULL,
      contribution_id TEXT UNIQUE NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
      donor_name TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      campaign_name TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      reference_no TEXT,
      collector_name TEXT NOT NULL,
      verification_status TEXT NOT NULL,
      qr_code_data TEXT NOT NULL,
      security_hash TEXT NOT NULL,
      issued_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Configurable Approval Thresholds
    CREATE TABLE IF NOT EXISTS approval_thresholds (
      id TEXT PRIMARY KEY,
      tier_name TEXT NOT NULL,
      min_amount REAL NOT NULL,
      max_amount REAL,
      required_roles_json TEXT NOT NULL, -- JSON array of roles e.g. ["TREASURER", "SECRETARY"]
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Expenses Management
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL CHECK(amount > 0),
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      campaign_id TEXT REFERENCES campaigns(id),
      event_id TEXT REFERENCES events(id),
      requested_by_id TEXT NOT NULL REFERENCES committee_members(id),
      date TEXT NOT NULL,
      vendor_name TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      supporting_bill_url TEXT,
      approval_status TEXT NOT NULL CHECK(approval_status IN (
        'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED'
      )) DEFAULT 'SUBMITTED',
      current_tier_id TEXT REFERENCES approval_thresholds(id),
      approved_by_roles_json TEXT DEFAULT '[]', -- JSON array of roles that have approved
      paid_at TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Expense Approval Log
    CREATE TABLE IF NOT EXISTS expense_approvals (
      id TEXT PRIMARY KEY,
      expense_id TEXT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
      approver_id TEXT NOT NULL REFERENCES users(id),
      role TEXT NOT NULL,
      decision TEXT NOT NULL CHECK(decision IN ('APPROVED', 'REJECTED', 'REQUEST_INFO')),
      notes TEXT,
      decided_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Double-Entry Financial Ledger (Strictly Immutable)
    CREATE TABLE IF NOT EXISTS ledger_entries (
      id TEXT PRIMARY KEY,
      transaction_ref TEXT NOT NULL,
      entry_type TEXT NOT NULL CHECK(entry_type IN ('CREDIT', 'DEBIT', 'ADJUSTMENT_CREDIT', 'ADJUSTMENT_DEBIT')),
      amount REAL NOT NULL CHECK(amount > 0),
      category TEXT NOT NULL,
      campaign_id TEXT REFERENCES campaigns(id),
      related_entity_type TEXT NOT NULL, -- 'CONTRIBUTION', 'EXPENSE', 'REFUND', 'ADJUSTMENT'
      related_entity_id TEXT NOT NULL,
      balance_after REAL NOT NULL,
      description TEXT NOT NULL,
      actor_id TEXT REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Events
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      event_date TEXT NOT NULL,
      event_time TEXT,
      venue TEXT NOT NULL,
      coordinator_id TEXT REFERENCES committee_members(id),
      budget REAL NOT NULL DEFAULT 0,
      actual_expense REAL NOT NULL DEFAULT 0,
      campaign_id TEXT REFERENCES campaigns(id),
      participants_count INTEGER DEFAULT 0,
      banner_url TEXT,
      status TEXT NOT NULL CHECK(status IN ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED')) DEFAULT 'UPCOMING',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Meetings & Action Items
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      meeting_date TEXT NOT NULL,
      location TEXT NOT NULL,
      agenda TEXT NOT NULL,
      decisions TEXT,
      minutes_doc_url TEXT,
      created_by_id TEXT REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meeting_action_items (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      assigned_to_id TEXT REFERENCES committee_members(id),
      deadline TEXT,
      status TEXT NOT NULL CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED')) DEFAULT 'PENDING',
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Documents Vault
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('BILL', 'RECEIPT', 'QUOTATION', 'PERMISSION', 'MINUTES', 'STATEMENT', 'OTHER')),
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      uploaded_by_id TEXT REFERENCES users(id),
      related_entity_type TEXT,
      related_entity_id TEXT,
      is_public INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- System Notifications
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      recipient_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('CONTRIBUTION', 'EXPENSE_APPROVAL', 'CAMPAIGN', 'EVENT', 'MEETING', 'SYSTEM')),
      read INTEGER NOT NULL DEFAULT 0,
      entity_link TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Immutable Audit Trail
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT NOT NULL,
      user_role TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      previous_value_json TEXT,
      new_value_json TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Organization Settings & Config
    CREATE TABLE IF NOT EXISTS organization_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_by_id TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Indexes for High Performance
    CREATE INDEX IF NOT EXISTS idx_contributions_campaign ON contributions(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
    CREATE INDEX IF NOT EXISTS idx_contributions_donor ON contributions(donor_name, phone);
    CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(approval_status);
    CREATE INDEX IF NOT EXISTS idx_expenses_campaign ON expenses(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_ledger_created ON ledger_entries(created_at);
    CREATE INDEX IF NOT EXISTS idx_ledger_entity ON ledger_entries(related_entity_type, related_entity_id);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
  `;

  await DB.exec(schemaSQL);
}
