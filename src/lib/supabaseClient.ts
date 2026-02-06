import { createClient } from '@supabase/supabase-js';

// Use environment variables from your .env or Vite config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Create and export a single client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
