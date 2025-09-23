import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface User {
  id: string; // UUID from Supabase Auth
  email: string;
  name: string;
  phone?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'individual' | 'combo';
  description: string;
  timeline: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  created_at: string;
  updated_at: string;
}
