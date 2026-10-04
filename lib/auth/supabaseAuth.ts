import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Client-side Supabase (for auth + public queries with RLS)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ── Auth helpers ──

export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  // Create a profile row for the new user if table exists and accessible
  if (data.user) {
    try {
      await supabase.from('profiles').insert([
        { id: data.user.id, email: data.user.email },
      ]);
    } catch (err) {
      console.warn('Profiles table insert skipped:', err);
    }
  }
  return data;
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

// ── Database helpers ──

export async function getUserDatabases(userId: string) {
  const { data, error } = await supabase
    .from('created_databases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function saveDatabaseSchema(
  userId: string,
  databaseName: string,
  schemaJson: object,
  connectionString: string,
) {
  const { data, error } = await supabase
    .from('created_databases')
    .insert([{ user_id: userId, database_name: databaseName, schema_json: schemaJson, connection_string: connectionString }]);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDatabaseRecord(recordId: number) {
  const { error } = await supabase.from('created_databases').delete().eq('id', recordId);
  if (error) throw new Error(error.message);
}

export async function resetPasswordForEmail(email: string, redirectTo?: string) {
  const redirectUrl =
    redirectTo ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : 'http://localhost:3000/reset-password');

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUserPassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
  return data;
}

// Aliases used by existing components
export const loginUser = signInUser;
export const registerUser = signUpUser;
