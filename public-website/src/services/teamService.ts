export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  phone?: string;
  email?: string;
  initials: string;
  image: string;
  order: number;
}

const STORAGE_KEY_TEAM = 'sky_team_members';

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-01',
    name: 'Ramesh Yadav',
    role: 'President',
    bio: 'Leading Sri Krishna Yadav Youth with grassroots community experience in Guraja. Dedicated to cultural unity, temple festivals, and youth development.',
    initials: 'RY',
    phone: '+91 98480 11111',
    image: '/images/gallery/guraja_youth_volunteers_group.png',
    order: 1
  },
  {
    id: 'team-02',
    name: 'Mahesh Yadav',
    role: 'Secretary',
    bio: 'Coordinates village cultural drives, event operations, youth volunteers, and keeps records of committee meetings and public resolutions.',
    initials: 'MY',
    phone: '+91 98480 22222',
    image: '/images/gallery/youth_tractor_ratham_procession.png',
    order: 2
  },
  {
    id: 'team-03',
    name: 'Suresh Yadav',
    role: 'Treasurer',
    bio: 'Manages the double-entry accounting ledger, digital receipt verification, vendor disbursements, and verified bank records.',
    initials: 'SY',
    phone: '+91 98480 33333',
    image: '/images/gallery/krishna_swamy_golden_arch.jpg',
    order: 3
  },
  {
    id: 'team-04',
    name: 'Venkatesh Yadav',
    role: 'Joint Secretary',
    bio: 'Oversees youth festival rallies, sound & lighting setup, and village community welfare programs.',
    initials: 'VY',
    phone: '+91 98480 44444',
    image: '/images/gallery/guraja_youth_procession_rally.png',
    order: 4
  }
];

export function getTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.order - b.order);
      }
    }
  } catch (err) {
    console.error('Error reading team members from storage:', err);
  }
  // Initialize defaults
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

export function addOrUpdateTeamMember(member: Partial<TeamMember> & { name: string; role: string; bio: string; image: string }): TeamMember {
  const current = getTeamMembers();
  const initials = member.name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  if (member.id) {
    // Update
    const idx = current.findIndex((m) => m.id === member.id);
    if (idx !== -1) {
      current[idx] = {
        ...current[idx],
        ...member,
        initials
      };
      saveTeamMembers(current);
      return current[idx];
    }
  }

  // Create New
  const newMember: TeamMember = {
    id: `team-${Date.now()}`,
    name: member.name.trim(),
    role: member.role.trim(),
    bio: member.bio.trim(),
    phone: member.phone?.trim() || undefined,
    email: member.email?.trim() || undefined,
    initials,
    image: member.image || '/images/gallery/guraja_youth_volunteers_group.png',
    order: current.length + 1
  };

  current.push(newMember);
  saveTeamMembers(current);
  return newMember;
}

export function deleteTeamMember(id: string): void {
  const current = getTeamMembers().filter((m) => m.id !== id);
  saveTeamMembers(current);
}

export function resetTeamMembersToDefault(): TeamMember[] {
  saveTeamMembers(DEFAULT_TEAM_MEMBERS);
  return DEFAULT_TEAM_MEMBERS;
}
