export interface Message {
  id: string;
  content: string;
  is_from_doctor: boolean;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  status: string;
  user_id: string;
}

export interface FileData {
  url: string;
  name: string;
  type: string;
}