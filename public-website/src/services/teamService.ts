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

// Starts clean and empty so the user can add all members dynamically to Supabase
export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [];

export function getTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
  } catch (err) {
    console.error('Error reading team members from storage:', err);
  }
  return [];
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
    if (cloudMembers && Array.isArray(cloudMembers)) {
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
 * Add or update member dynamically in Supabase and local storage
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

  // Sync to Supabase in real-time
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

  return targetMember;
}

/**
 * Delete a member from Supabase and local storage
 */
export async function deleteTeamMember(id: string): Promise<void> {
  const current = getTeamMembers().filter((m) => m.id !== id);
  saveTeamMembers(current);
  await deleteSupabaseMember(id);
}

/**
 * Clear all members from Supabase and local storage
 */
export async function removeAllTeamMembers(): Promise<void> {
  saveTeamMembers([]);
  await clearAllSupabaseMembers();
}

export function resetTeamMembersToDefault(): TeamMember[] {
  saveTeamMembers([]);
  return [];
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
