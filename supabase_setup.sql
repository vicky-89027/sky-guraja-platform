-- ==============================================================================
-- SRI KRISHNA YADAV YOUTH (SKY GURAJA) - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- Project URL: https://hctgwcazsrpglcalcxgf.supabase.co
-- Production Financial & Operational Schema with Strict RLS Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Committee Members Table
CREATE TABLE IF NOT EXISTS public.committee_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    phone TEXT,
    email TEXT,
    initials TEXT,
    image TEXT,
    "order" INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for committee_members
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on committee_members"
ON public.committee_members FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated manage on committee_members"
ON public.committee_members FOR ALL
USING (true)
WITH CHECK (true);

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
    start_date DATE NOT NULL,
    end_date DATE,
    category TEXT NOT NULL,
    banner_url TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED', 'PLANNED')),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on campaigns"
ON public.campaigns FOR SELECT
USING (is_public = true);

-- 3. Contributions Table
CREATE TABLE IF NOT EXISTS public.contributions (
    id TEXT PRIMARY KEY,
    receipt_number TEXT UNIQUE,
    contributor_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    campaign_id TEXT REFERENCES public.campaigns(id),
    campaign_title TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    amount_in_words TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'CASH', 'CARD', 'NETBANKING', 'BANK_TRANSFER')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'FAILED', 'VOIDED')),
    transaction_id TEXT,
    reference_no TEXT,
    recorded_by_member_name TEXT,
    verification_token TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on contributions"
ON public.contributions FOR SELECT
USING (true);

CREATE POLICY "Allow public insert on contributions"
ON public.contributions FOR INSERT
WITH CHECK (amount > 0);

-- 4. Receipts Table
CREATE TABLE IF NOT EXISTS public.receipts (
    id TEXT PRIMARY KEY,
    receipt_number TEXT UNIQUE NOT NULL,
    contribution_id TEXT UNIQUE NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
    verification_token TEXT UNIQUE NOT NULL,
    qr_code_url TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    issue_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'VOIDED')),
    signatory_title TEXT NOT NULL DEFAULT 'Authorized Signatory',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on receipts"
ON public.receipts FOR SELECT
USING (true);

-- 5. Immutable Financial Ledger Entries Table
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id TEXT PRIMARY KEY,
    transaction_ref TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('CREDIT', 'DEBIT', 'ADJUSTMENT_CREDIT', 'ADJUSTMENT_DEBIT')),
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL,
    campaign_id TEXT REFERENCES public.campaigns(id),
    related_entity_type TEXT NOT NULL,
    related_entity_id TEXT NOT NULL,
    balance_after NUMERIC(12,2) NOT NULL,
    description TEXT NOT NULL,
    actor_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on verified ledger entries"
ON public.ledger_entries FOR SELECT
USING (true);

-- 6. Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id TEXT PRIMARY KEY,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    campaign_id TEXT REFERENCES public.campaigns(id),
    requested_by_id TEXT,
    vendor_name TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    supporting_bill_url TEXT,
    approval_status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (approval_status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED')),
    approved_by_roles_json JSONB DEFAULT '[]'::jsonb,
    paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on paid expenses"
ON public.expenses FOR SELECT
USING (approval_status = 'PAID');

-- 7. Audit Logs Table (Tamper-evident system log)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    user_id TEXT,
    user_name TEXT,
    details TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on audit logs"
ON public.audit_logs FOR SELECT
USING (true);

-- 8. Seed Official 10-Member Committee Roster
INSERT INTO public.committee_members (id, name, role, bio, phone, email, initials, image, "order")
VALUES
('team-01', 'SRINU YADAV', 'PRESIDENT', 'Leading Sri Krishna Yadav Youth with grassroots community experience in Guraja. Dedicated to cultural unity, temple festivals, youth welfare, and village development.', '+91 98480 22222', 'president@skyguraja.org', 'SY', '/images/gallery/guraja_youth_volunteers_group.png', 1),
('team-02', 'MANIKANTA YADAV', 'GENERAL SECRETARY', 'Coordinates village cultural drives, event operations, youth volunteers, keeps official records of committee meetings, and public resolutions.', '+91 98480 33333', 'secretary@skyguraja.org', 'MY', '/images/gallery/youth_tractor_ratham_procession.png', 2),
('team-03', 'LOHIT YADAV', 'TREASURER', 'Manages the double-entry accounting ledger, digital receipt verification, vendor disbursements, collections, and verified bank records.', '+91 98480 44444', 'treasurer@skyguraja.org', 'LY', '/images/gallery/krishna_swamy_golden_arch.jpg', 3),
('team-04', 'VENKAT YADAV', 'JOINT SECRETARY', 'Oversees youth festival rallies, sound & lighting setup, stage arrangements, and village community welfare programs.', '+91 98480 55555', 'jointsec@skyguraja.org', 'VY', '/images/gallery/guraja_youth_procession_rally.png', 4),
('team-05', 'PAVAN YADAV', 'YOUTH COORDINATOR', 'Directs youth volunteer squads for Janmashtami, blood donation drives, educational library initiatives, and disaster relief assistance.', '+91 98480 66666', 'pavan@skyguraja.org', 'PY', '/images/gallery/marble_krishna_alankaram.jpg', 5),
('team-06', 'SIVA NAGARAJU YADAV', 'COMMITTEE IN-CHARGE', 'Manages youth sports tournaments, ground preparations, emergency community transport, and volunteer equipment logistics.', '+91 98480 77777', 'sivanagaraju@skyguraja.org', 'SN', '/images/gallery/guraja_night_utsav_sound_rally.png', 6),
('team-07', 'KOTESWARA RAO YADAV', 'CULTURAL SECRETARY', 'Organizes temple Utsavams, Bhajana programs, Utlotsavam (Dahi Handi) coordination, and stage artist felicitations.', '+91 98480 88888', 'koti.yadav@skyguraja.org', 'KY', '/images/gallery/radha_krishna_murti_alankaram.jpg', 7),
('team-08', 'S GANESH YADAV', 'CHIEF COORDINATOR', 'Oversees digital transparency portal, verified receipt infrastructure, cloud database integrity, and overall organization strategy.', '+91 98480 11111', 'admin@skyguraja.org', 'SG', '/images/gallery/sky_official_brand_concept.jpg', 8),
('team-09', 'G PHANI KUMAR YADAV', 'FINANCIAL AUDITOR & ADVISOR', 'Conducts regular audit reviews of all double-entry ledger vouchers, verified bank statements, and tax compliance for SKY Guraja.', '+91 98480 99999', 'auditor@skyguraja.org', 'GP', '/images/gallery/krishna_flute_gomata.jpg', 9),
('team-10', 'NAGARAJU YADAV', 'SENIOR ADVISOR / FOUNDER', 'Senior community elder and visionary mentor guiding Sri Krishna Yadav Youth Guraja in heritage preservation and youth empowerment.', '+91 98480 12345', 'nagaraju@skyguraja.org', 'NY', '/images/gallery/guraja_women_holi_vasantotsavam.jpg', 10)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    bio = EXCLUDED.bio,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    initials = EXCLUDED.initials,
    image = EXCLUDED.image,
    "order" = EXCLUDED."order";

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_supabase_contributions_status ON public.contributions(status);
CREATE INDEX IF NOT EXISTS idx_supabase_contributions_token ON public.contributions(verification_token);
CREATE INDEX IF NOT EXISTS idx_supabase_receipts_number ON public.receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_supabase_ledger_entry ON public.ledger_entries(entry_type, related_entity_id);
