import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

// Service-role client: bypasses Row Level Security. Server-side only, never send this key to a browser.
export const supabase = createClient(config.supabase.url, config.supabase.key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
