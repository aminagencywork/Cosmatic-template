import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  original_price: number;
  discount: number;
  skin_types: string[];
  shades: string[];
  images: string[];
  description: string;
  ingredients: string;
  created_at: string;
};

export type Banner = {
  id: string;
  image_url: string;
  is_active: boolean;
};

export type Config = {
  key: string;
  value: any;
};
