import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// Public Supabase client
export const supabasePublic = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

// Server-side Admin Supabase client (bypasses RLS, used for user creation & RPC DDL)
export const supabaseAdmin = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
