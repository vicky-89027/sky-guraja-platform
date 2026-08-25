export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  phone?: string;
  email?: string;
  username?: string;
  initials: string;
  image: string;
  order: number;
}

const STORAGE_KEY_TEAM = 'sky_team_members_v2026';

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-01',
    name: 'Nagaraju Yadav',
    role: 'President',
    bio: 'Leading Sri Krishna Yadav Youth with grassroots community experience in Guraja. Dedicated to cultural unity, temple festivals, youth welfare, and village development.',
    initials: 'NY',
    phone: '+91 98480 22222',
    email: 'president@skyguraja.org',
    username: 'president',
    image: '/images/gallery/guraja_youth_volunteers_group.png',
    order: 1
  },
  {
    id: 'team-02',
    name: 'Suresh Kumar Yadav',
    role: 'General Secretary',
    bio: 'Coordinates village cultural drives, event operations, youth volunteers, keeps official records of committee meetings, and public resolutions.',
    initials: 'SY',
    phone: '+91 98480 33333',
    email: 'secretary@skyguraja.org',
    username: 'secretary',
    image: '/images/gallery/youth_tractor_ratham_procession.png',
    order: 2
  },
  {
    id: 'team-03',
    name: 'Ramesh Yadav',
    role: 'Treasurer',
    bio: 'Manages the double-entry accounting ledger, digital receipt verification, vendor disbursements, collections, and verified bank records.',
    initials: 'RY',
    phone: '+91 98480 44444',
    email: 'treasurer@skyguraja.org',
    username: 'treasurer',
    image: '/images/gallery/krishna_swamy_golden_arch.jpg',
    order: 3
  },
  {
    id: 'team-04',
    name: 'Venkatesh Yadav',
    role: 'Joint Secretary',
    bio: 'Oversees youth festival rallies, sound & lighting setup, stage arrangements, and village community welfare programs.',
    initials: 'VY',
    phone: '+91 98480 55555',
    email: 'jointsec@skyguraja.org',
    username: 'jointsec',
    image: '/images/gallery/guraja_youth_procession_rally.png',
    order: 4
  },
  {
    id: 'team-05',
    name: 'Pavan Kalyan Yadav',
    role: 'Youth Coordinator',
    bio: 'Directs youth volunteer squads for Janmashtami, blood donation drives, educational library initiatives, and disaster relief assistance.',
    initials: 'PK',
    phone: '+91 98480 66666',
    email: 'pavan@skyguraja.org',
    username: 'pavan',
    image: '/images/gallery/marble_krishna_alankaram.jpg',
    order: 5
  },
  {
    id: 'team-06',
    name: 'Anil Yadav',
    role: 'Sports & Logistics In-Charge',
    bio: 'Manages youth sports tournaments, ground preparations, emergency community transport, and volunteer equipment logistics.',
    initials: 'AY',
    phone: '+91 98480 77777',
    email: 'anil.yadav@skyguraja.org',
    username: 'anil',
    image: '/images/gallery/guraja_night_utsav_sound_rally.png',
    order: 6
  },
  {
    id: 'team-07',
    name: 'Koteswara Rao Yadav',
    role: 'Cultural Secretary',
    bio: 'Organizes temple Utsavams, Bhajana programs, Utlotsavam (Dahi Handi) coordination, and stage artist felicitations.',
    initials: 'KY',
    phone: '+91 98480 88888',
    email: 'koti.yadav@skyguraja.org',
    username: 'koteswara',
    image: '/images/gallery/radha_krishna_murti_alankaram.jpg',
    order: 7
  },
  {
    id: 'team-08',
    name: 'Venkata Krishna Yadav',
    role: 'Super Admin & Chief Coordinator',
    bio: 'Oversees digital transparency portal, verified receipt infrastructure, cloud database integrity, and overall organization strategy.',
    initials: 'VK',
    phone: '+91 98480 11111',
    email: 'admin@skyguraja.org',
    username: 'admin',
    image: '/images/gallery/sky_official_brand_concept.jpg',
    order: 8
  },
  {
    id: 'team-09',
    name: 'G. V. R. Prasad (CA)',
    role: 'Financial Auditor & Advisor',
    bio: 'Conducts regular audit reviews of all double-entry ledger vouchers, verified bank statements, and tax compliance for SKY Guraja.',
    initials: 'GP',
    phone: '+91 98480 99999',
    email: 'auditor@skyguraja.org',
    username: 'auditor',
    image: '/images/gallery/krishna_flute_gomata.jpg',
    order: 9
  },
  {
    id: 'team-10',
    name: 'Anand Kumar Yadav',
    role: 'Youth Contributor & Volunteer',
    bio: 'Dedicated youth devotee and community contributor supporting temple Annadanam and village sanitation drives.',
    initials: 'AK',
    phone: '+91 98480 12345',
    email: 'donor@skyguraja.org',
    username: 'donor',
    image: '/images/gallery/guraja_women_holi_vasantotsavam.jpg',
    order: 10
  }
];

export function getTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 4) {
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

export function saveTeamMembers(members: TeamMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(members));
    
    // Background sync with database if backend is reachable
    fetch('/api/members/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members })
    }).catch(() => {
      // Standalone mode fallback
    });
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

