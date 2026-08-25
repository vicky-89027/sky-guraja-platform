import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://hctgwcazsrpglcalcxgf.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_EqvwimFyy8RRC0LTMcxbag_NWL9nz73';

// Initialize Supabase Client with auto session & storage
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export interface SupabaseCommitteeMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  phone?: string;
  email?: string;
  initials?: string;
  image?: string;
  order?: number;
  created_at?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => ({
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY
});

export const saveSupabaseConfig = (_config: SupabaseConfig): void => {};

export const isSupabaseConfigured = (): boolean => true;

/**
 * Fetch all committee members from Supabase in real-time
 */
export async function getSupabaseMembers(): Promise<SupabaseCommitteeMember[]> {
  try {
    const { data, error } = await supabase
      .from('committee_members')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Supabase getMembers error:', err);
    return [];
  }
}

/**
 * Save or Update a member in Supabase
 */
export async function upsertSupabaseMember(member: SupabaseCommitteeMember): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('committee_members')
      .upsert(member, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase upsert exception:', err);
    return false;
  }
}

/**
 * Sync members array to Supabase
 */
export async function syncMembersToSupabase(members: any[]): Promise<boolean> {
  try {
    if (!members || members.length === 0) return true;
    const { error } = await supabase
      .from('committee_members')
      .upsert(members, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete a member from Supabase by ID
 */
export async function deleteSupabaseMember(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('committee_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete exception:', err);
    return false;
  }
}

/**
 * Clear all members from Supabase table
 */
export async function clearAllSupabaseMembers(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('committee_members')
      .delete()
      .neq('id', '___non_existent___');

    if (error) {
      console.error('Supabase clear error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase clear exception:', err);
    return false;
  }
}
