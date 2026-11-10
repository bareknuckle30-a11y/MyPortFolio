import { createClient } from '@supabase/supabase-js';

// Browser client for /admin only. It uses the public ANON key; Row Level Security decides what a
// signed-in admin can read. Never put the service-role key in client code.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && key && !url.includes('YOUR-PROJECT'));
export const supabase = supabaseConfigured ? createClient(url, key) : null;
