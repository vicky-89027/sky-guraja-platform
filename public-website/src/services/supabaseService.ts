/**
 * Supabase Cloud Realtime & REST Database Integration
 * Enables instant global multi-device synchronization across mobile and desktop.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const SUPABASE_STORAGE_KEY = 'sky_supabase_config_v1';

export const DEFAULT_SUPABASE_CONFIG: SupabaseConfig = {
  url: 'https://hctgwcazsrpglcalcxgf.supabase.co',
  anonKey: 'sb_publishable_EqvwimFyy8RRC0LTMcxbag_NWL9nz73'
};

// Default / configured Supabase credentials (can be overridden via environment variables or settings)
export const getSupabaseConfig = (): SupabaseConfig => {
  try {
    const saved = localStorage.getItem(SUPABASE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) return parsed;
    }
  } catch {}

  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_CONFIG.url,
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_CONFIG.anonKey
  };
};

export const saveSupabaseConfig = (config: SupabaseConfig): void => {
  try {
    localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify(config));
  } catch {}
};

export const isSupabaseConfigured = (): boolean => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith('https://'));
};

/**
 * Fetch all committee members from Supabase table 'committee_members'
 */
export async function fetchSupabaseMembers(): Promise<any[] | null> {
  const cfg = getSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) return null;

  try {
    const endpoint = `${cfg.url.replace(/\/$/, '')}/rest/v1/committee_members?select=*&order=order.asc`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch (err) {
    console.error('Supabase fetch members error:', err);
    return null;
  }
}

/**
 * Sync / Upsert team members into Supabase table 'committee_members'
 */
export async function syncMembersToSupabase(members: any[]): Promise<boolean> {
  const cfg = getSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) return false;

  try {
    const endpoint = `${cfg.url.replace(/\/$/, '')}/rest/v1/committee_members`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(members)
    });

    return res.ok;
  } catch (err) {
    console.error('Supabase sync members error:', err);
    return false;
  }
}
