export interface Profile {
  id: string;
  full_name: string;
  gender: string;
  age: string;
  complaint: string;
  phone?: string;
  role?: 'admin' | 'patient';
}

export interface Message {
  id: string;
  content: string;
  is_from_doctor: boolean;
  created_at: string;
  delivered_at: string | null;
  seen_at: string | null;
  status: string;
  user_id: string;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  duration?: number;
}