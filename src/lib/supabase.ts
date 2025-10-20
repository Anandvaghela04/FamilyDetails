import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FamilyRecord {
  id: string;
  head_name: string;
  head_photo_url: string | null;
  head_dob: string;
  address: string;
  mobile: string;
  education: string;
  occupation: string;
  marital_status: string;
  wife_details: {
    name?: string;
    dob?: string;
    education?: string;
    occupation?: string;
  };
  children: Array<{
    name: string;
    dob: string;
    address: string;
    mobile: string;
    education: string;
    occupation: string;
    relation: string;
    marital_status?: string;
    spouse_details?: {
      name?: string;
      dob?: string;
      education?: string;
      occupation?: string;
    };
  }>;
  created_at: string;
}
