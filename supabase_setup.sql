-- ==============================================================================
-- SRI KRISHNA YADAV YOUTH (SKY GURAJA) - SUPABASE DATABASE INITIALIZATION
-- Project URL: https://hctgwcazsrpglcalcxgf.supabase.co
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/hctgwcazsrpglcalcxgf/sql)
-- ==============================================================================

-- 1. Create Committee Members Table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) and Allow Public Read & Write Access
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on committee_members" 
ON public.committee_members FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert and update on committee_members" 
ON public.committee_members FOR ALL 
USING (true) 
WITH CHECK (true);

-- 2. Seed Official 10-Member Committee Roster
INSERT INTO public.committee_members (id, name, role, bio, phone, email, initials, image, "order")
VALUES
('team-01', 'Nagaraju Yadav', 'President', 'Leading Sri Krishna Yadav Youth with grassroots community experience in Guraja. Dedicated to cultural unity, temple festivals, youth welfare, and village development.', '+91 98480 22222', 'president@skyguraja.org', 'NY', '/images/gallery/guraja_youth_volunteers_group.png', 1),
('team-02', 'Suresh Kumar Yadav', 'General Secretary', 'Coordinates village cultural drives, event operations, youth volunteers, keeps official records of committee meetings, and public resolutions.', '+91 98480 33333', 'secretary@skyguraja.org', 'SY', '/images/gallery/youth_tractor_ratham_procession.png', 2),
('team-03', 'Ramesh Yadav', 'Treasurer', 'Manages the double-entry accounting ledger, digital receipt verification, vendor disbursements, collections, and verified bank records.', '+91 98480 44444', 'treasurer@skyguraja.org', 'RY', '/images/gallery/krishna_swamy_golden_arch.jpg', 3),
('team-04', 'Venkatesh Yadav', 'Joint Secretary', 'Oversees youth festival rallies, sound & lighting setup, stage arrangements, and village community welfare programs.', '+91 98480 55555', 'jointsec@skyguraja.org', 'VY', '/images/gallery/guraja_youth_procession_rally.png', 4),
('team-05', 'PAVAN YADAV', 'YOUTH COORDINATOR', 'Directs youth volunteer squads for Janmashtami, blood donation drives, educational library initiatives, and disaster relief assistance.', '+91 98480 66666', 'pavan@skyguraja.org', 'PY', '/images/gallery/marble_krishna_alankaram.jpg', 5),
('team-06', 'SIVA NAGARAJU YADAV', 'COMMITTEE IN-CHARGE', 'Manages youth sports tournaments, ground preparations, emergency community transport, and volunteer equipment logistics.', '+91 98480 77777', 'sivanagaraju@skyguraja.org', 'SN', '/images/gallery/guraja_night_utsav_sound_rally.png', 6),
('team-07', 'Koteswara Rao Yadav', 'MEMBER', 'Organizes temple Utsavams, Bhajana programs, Utlotsavam (Dahi Handi) coordination, and stage artist felicitations.', '+91 98480 88888', 'koti.yadav@skyguraja.org', 'KY', '/images/gallery/radha_krishna_murti_alankaram.jpg', 7),
('team-08', 'S GANESH YADAV', 'CHIEF COORDINATOR', 'Oversees digital transparency portal, verified receipt infrastructure, cloud database integrity, and overall organization strategy.', '+91 98480 11111', 'admin@skyguraja.org', 'SG', '/images/gallery/sky_official_brand_concept.jpg', 8),
('team-09', 'G PHANI KUMAR YADAV', 'FINANCIAL AUDITOR & ADVISOR', 'Conducts regular audit reviews of all double-entry ledger vouchers, verified bank statements, and tax compliance for SKY Guraja.', '+91 98480 99999', 'auditor@skyguraja.org', 'GP', '/images/gallery/krishna_flute_gomata.jpg', 9),
('team-10', 'T SIRNU YADAV', 'YOUTH COORDINATOR', 'Dedicated youth devotee and community contributor supporting temple Annadanam and village sanitation drives.', '+91 98480 12345', 'srinu@skyguraja.org', 'TS', '/images/gallery/guraja_women_holi_vasantotsavam.jpg', 10)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    bio = EXCLUDED.bio,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    initials = EXCLUDED.initials,
    image = EXCLUDED.image,
    "order" = EXCLUDED."order";
