export interface Message {
  id: string;
  content: string;
  user_id: string;
  is_from_doctor: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  status: string;
  delivered_at?: string | null;
  seen_at?: string | null;
  is_resolved?: boolean;
  sender_name?: string;
  duration?: number | null;  // Made nullable to maintain compatibility
  replyTo?: {
    content: string;
    file_type?: string | null;
    file_url?: string | null;
    sender_name?: string | null;
  } | null;
  referenced_message?: {
    id: string;
    content: string;
    sender_name?: string;
    file_type?: string;
  } | null;
  typing_users?: string[];
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  gender?: string;
  age?: string;
  complaint?: string;
  created_at?: string;
  updated_at?: string;
  auth_method?: string;
  last_login?: string;
  password: string;
  role: 'admin' | 'patient';
  payment_status?: string;
  payment_method?: string;
  payment_date?: string;
  payment_approval_status?: string;
}