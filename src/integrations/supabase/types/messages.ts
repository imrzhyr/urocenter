export interface Message {
  content: string;
  created_at: string | null;
  file_name: string | null;
  file_type: string | null;
  file_url: string | null;
  id: string;
  is_from_doctor: boolean | null;
  is_read: boolean | null;
  status: string;
  updated_at: string | null;
  user_id: string;
}

export interface MessageInsert {
  content: string;
  created_at?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_url?: string | null;
  id?: string;
  is_from_doctor?: boolean | null;
  is_read?: boolean | null;
  status?: string;
  updated_at?: string | null;
  user_id: string;
}

export interface MessageUpdate {
  content?: string;
  created_at?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_url?: string | null;
  id?: string;
  is_from_doctor?: boolean | null;
  is_read?: boolean | null;
  status?: string;
  updated_at?: string | null;
  user_id?: string;
}