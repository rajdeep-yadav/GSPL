import { createClient } from '@supabase/supabase-js';

// Read exclusively from environment variables (.env in dev, project environment variables in production)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey &&
  !supabaseUrl.includes('sample-project')
);

// Fallback dummy client for build-time safety if env vars aren't injected during SSG
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
