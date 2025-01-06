export interface Message {
  id: string;
  content: string;
  is_from_doctor?: boolean;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  status: string;
  user_id: string;
}

export interface MessageInsert {
  content: string;
  is_from_doctor?: boolean;
  is_read?: boolean;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  status?: string;
  user_id: string;
}

export interface FileData {
  url: string;
  name: string;
  type: string;
}