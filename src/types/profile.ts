export type MessageType = 'message' | 'call';

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
  file_urls?: string[];
  file_names?: string[];
  file_types?: string[];
  status: string;
  delivered_at?: string;
  seen_at?: string;
  duration?: number;
  is_resolved?: boolean;
  sender_name?: string;
  replyTo?: {
    id: string;
    content: string;
    sender_name?: string;
    file_type?: string;
  };
  typing_users?: string[];
  referenced_message?: {
    id: string;
    content: string;
    sender_name?: string;
    file_type?: string;
  } | null;
  type?: MessageType;
  call?: {
    id: string;
    caller_id: string;
    receiver_id: string;
    status: string;
    started_at: string;
    ended_at: string | null;
    created_at: string;
  };
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
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

export interface ProfileUpdate extends Partial<Profile> {
  password?: string;
}