import {
  getSupabaseMembers,
  upsertSupabaseMember,
  deleteSupabaseMember,
  clearAllSupabaseMembers,
  SupabaseCommitteeMember
} from './supabaseService';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  phone?: string;
  email?: string;
  initials: string;
  username?: string;
  order: number;
}

const STORAGE_KEY_TEAM = 'sky_team_members_dynamic_v2026';

// Official verified committee roster matching live user database
export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-01',
    name: 'SRINU YADAV',
    role: 'PRESIDENT',
    bio: 'Leading Sri Krishna Yadav Youth with grassroots community experience in Guraja. Dedicated to cultural unity, temple festivals, youth welfare, and village development.',
    phone: '+91 98480 22222',
    email: 'president@skyguraja.org',
    initials: 'SY',
    image: '/images/gallery/guraja_youth_volunteers_group.png',
    order: 1
  },
  {
    id: 'team-02',
    name: 'MANIKANTA YADAV',
    role: 'GENERAL SECRETARY',
    bio: 'Coordinates village cultural drives, event operations, youth volunteers, keeps official records of committee meetings, and public resolutions.',
    phone: '+91 98480 33333',
    email: 'secretary@skyguraja.org',
    initials: 'MY',
    image: '/images/gallery/youth_tractor_ratham_procession.png',
    order: 2
  },
  {
    id: 'team-03',
    name: 'LOHIT YADAV',
    role: 'TREASURER',
    bio: 'Manages the double-entry accounting ledger, digital receipt verification, vendor disbursements, collections, and verified bank records.',
    phone: '+91 98480 44444',
    email: 'treasurer@skyguraja.org',
    initials: 'LY',
    image: '/images/gallery/krishna_swamy_golden_arch.jpg',
    order: 3
  },
  {
    id: 'team-04',
    name: 'VENKAT YADAV',
    role: 'JOINT SECRETARY',
    bio: 'Oversees youth festival rallies, sound & lighting setup, stage arrangements, and village community welfare programs.',
    phone: '+91 98480 55555',
    email: 'jointsec@skyguraja.org',
    initials: 'VY',
    image: '/images/gallery/guraja_youth_procession_rally.png',
    order: 4
  },
  {
    id: 'team-05',
    name: 'PAVAN YADAV',
    role: 'YOUTH COORDINATOR',
    bio: 'Directs youth volunteer squads for Janmashtami, blood donation drives, educational library initiatives, and disaster relief assistance.',
    phone: '+91 98480 66666',
    email: 'pavan@skyguraja.org',
    initials: 'PY',
    image: '/images/gallery/marble_krishna_alankaram.jpg',
    order: 5
  },
  {
    id: 'team-06',
    name: 'SIVA NAGARAJU YADAV',
    role: 'COMMITTEE IN-CHARGE',
    bio: 'Manages youth sports tournaments, ground preparations, emergency community transport, and volunteer equipment logistics.',
    phone: '+91 98480 77777',
    email: 'sivanagaraju@skyguraja.org',
    initials: 'SN',
    image: '/images/gallery/guraja_night_utsav_sound_rally.png',
    order: 6
  },
  {
    id: 'team-07',
    name: 'KOTESWARA RAO YADAV',
    role: 'CULTURAL SECRETARY',
    bio: 'Organizes temple Utsavams, Bhajana programs, Utlotsavam (Dahi Handi) coordination, and stage artist felicitations.',
    phone: '+91 98480 88888',
    email: 'koti.yadav@skyguraja.org',
    initials: 'KY',
    image: '/images/gallery/radha_krishna_murti_alankaram.jpg',
    order: 7
  },
  {
    id: 'team-08',
    name: 'S GANESH YADAV',
    role: 'CHIEF COORDINATOR',
    bio: 'Oversees digital transparency portal, verified receipt infrastructure, cloud database integrity, and overall organization strategy.',
    phone: '+91 98480 11111',
    email: 'admin@skyguraja.org',
    initials: 'SG',
    image: '/images/gallery/sky_official_brand_concept.jpg',
    order: 8
  },
  {
    id: 'team-09',
    name: 'G PHANI KUMAR YADAV',
    role: 'FINANCIAL AUDITOR & ADVISOR',
    bio: 'Conducts regular audit reviews of all double-entry ledger vouchers, verified bank statements, and tax compliance for SKY Guraja.',
    phone: '+91 98480 99999',
    email: 'auditor@skyguraja.org',
    initials: 'GP',
    image: '/images/gallery/krishna_flute_gomata.jpg',
    order: 9
  },
  {
    id: 'team-10',
    name: 'NAGARAJU YADAV',
    role: 'SENIOR ADVISOR / FOUNDER',
    bio: 'Senior community elder and visionary mentor guiding Sri Krishna Yadav Youth Guraja in heritage preservation and youth empowerment.',
    phone: '+91 98480 12345',
    email: 'srinu@skyguraja.org',
    initials: 'NY',
    image: '/images/gallery/guraja_women_holi_vasantotsavam.jpg',
    order: 10
  }
];

export function getTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
  } catch (err) {
    console.error('Error reading team members from storage:', err);
  }
  // Initialize with official defaults
  saveTeamMembers(DEFAULT_TEAM_MEMBERS);
  return DEFAULT_TEAM_MEMBERS;
}

export function saveTeamMembers(members: TeamMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(members));
  } catch (err) {
    console.error('Error saving team members to storage:', err);
  }
}

/**
 * Fetch live data from Supabase and cache locally
 */
export async function hydrateTeamFromSupabase(): Promise<TeamMember[]> {
  try {
    const cloudMembers = await getSupabaseMembers();
    if (cloudMembers && Array.isArray(cloudMembers) && cloudMembers.length > 0) {
      const mapped: TeamMember[] = cloudMembers.map((m, idx) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        bio: m.bio || '',
        phone: m.phone || undefined,
        email: m.email || undefined,
        initials: m.initials || m.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
        image: m.image || '/images/gallery/guraja_youth_volunteers_group.png',
        order: m.order ?? (idx + 1)
      }));
      saveTeamMembers(mapped);
      return mapped;
    }
  } catch (err) {
    console.error('Failed hydrating team from Supabase:', err);
  }
  return getTeamMembers();
}

/**
 * Add or update member dynamically in Supabase, server DB, and local storage
 */
export async function addOrUpdateTeamMember(
  member: Partial<TeamMember> & { name: string; role: string; bio: string; image: string }
): Promise<TeamMember> {
  const current = getTeamMembers();
  const initials = member.name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  let targetMember: TeamMember;

  if (member.id) {
    const idx = current.findIndex((m) => m.id === member.id);
    targetMember = {
      id: member.id,
      name: member.name.trim(),
      role: member.role.trim(),
      bio: member.bio.trim(),
      phone: member.phone?.trim() || undefined,
      email: member.email?.trim() || undefined,
      initials,
      image: member.image || '/images/gallery/guraja_youth_volunteers_group.png',
      order: idx !== -1 ? current[idx].order : current.length + 1
    };
    if (idx !== -1) {
      current[idx] = targetMember;
    } else {
      current.push(targetMember);
    }
  } else {
    targetMember = {
      id: `mem-${Date.now()}`,
      name: member.name.trim(),
      role: member.role.trim(),
      bio: member.bio.trim(),
      phone: member.phone?.trim() || undefined,
      email: member.email?.trim() || undefined,
      initials,
      image: member.image || '/images/gallery/guraja_youth_volunteers_group.png',
      order: current.length + 1
    };
    current.push(targetMember);
  }

  saveTeamMembers(current);

  // 1. Sync to Supabase in real-time
  try {
    await upsertSupabaseMember({
      id: targetMember.id,
      name: targetMember.name,
      role: targetMember.role,
      bio: targetMember.bio,
      phone: targetMember.phone,
      email: targetMember.email,
      initials: targetMember.initials,
      image: targetMember.image,
      order: targetMember.order
    });
  } catch (sbErr) {
    console.error('Supabase sync error:', sbErr);
  }

  // 2. Sync to Backend Server API if reachable
  try {
    fetch('/api/members/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members: [targetMember] })
    }).catch(() => {});
  } catch {}

  return targetMember;
}

/**
 * Delete a member from Supabase, server DB, and local storage
 */
export async function deleteTeamMember(id: string): Promise<void> {
  const current = getTeamMembers().filter((m) => m.id !== id);
  saveTeamMembers(current);

  // Sync delete to Supabase
  try {
    await deleteSupabaseMember(id);
  } catch (err) {
    console.error('Supabase delete error:', err);
  }

  // Sync to Backend Server API
  try {
    fetch(`/api/members/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false })
    }).catch(() => {});
  } catch {}
}

/**
 * Clear all members from Supabase and local storage
 */
export async function removeAllTeamMembers(): Promise<void> {
  saveTeamMembers([]);
  await clearAllSupabaseMembers();
}

export function resetTeamMembersToDefault(): TeamMember[] {
  saveTeamMembers(DEFAULT_TEAM_MEMBERS);
  return DEFAULT_TEAM_MEMBERS;
}

export function getMemberPhoto(identifier: string): string {
  if (!identifier) return '/images/gallery/guraja_youth_volunteers_group.png';
  const clean = identifier.trim().toLowerCase();
  const members = getTeamMembers();
  const found = members.find(
    (m) =>
      m.name.toLowerCase().includes(clean) ||
      clean.includes(m.name.toLowerCase().split(' ')[0]) ||
      (m.username && m.username.toLowerCase() === clean) ||
      (m.phone && m.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''))) ||
      (m.role && m.role.toLowerCase() === clean)
  );
  return found?.image || '/images/gallery/guraja_youth_volunteers_group.png';
}
