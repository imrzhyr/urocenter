export interface Message {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_from_doctor: boolean;
  is_read: boolean;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  status: string;
  delivered_at?: string;
  seen_at?: string;
  duration?: number;
  is_resolved?: boolean;
  sender_name?: string;
  replyTo?: Message | null;
}

export interface Profile {
  id: string;
  full_name: string;
  gender: string;
  age: string;
  complaint: string;
  phone: string;
  role: "admin" | "patient";
  auth_method?: string;
  last_login?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
}