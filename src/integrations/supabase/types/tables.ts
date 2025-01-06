export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'patient';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

interface Database {
  public: {
    Tables: {
      medical_reports: {
        Row: {
          created_at: string;
          file_name: string;
          file_path: string;
          file_type: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          file_name: string;
          file_path: string;
          file_type?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          file_name?: string;
          file_path?: string;
          file_type?: string | null;
          id?: string;
          user_id?: string;
        };
      };
      messages: {
        Row: {
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
        };
        Insert: {
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
        };
        Update: {
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
        };
      };
      profiles: {
        Row: {
          age: string | null;
          auth_method: string | null;
          complaint: string | null;
          created_at: string | null;
          full_name: string | null;
          gender: string | null;
          id: string;
          last_login: string | null;
          password: string;
          phone: string | null;
          role: UserRole;
          updated_at: string | null;
        };
        Insert: {
          age?: string | null;
          auth_method?: string | null;
          complaint?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id?: string;
          last_login?: string | null;
          password: string;
          phone?: string | null;
          role?: UserRole;
          updated_at?: string | null;
        };
        Update: {
          age?: string | null;
          auth_method?: string | null;
          complaint?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id?: string;
          last_login?: string | null;
          password?: string;
          phone?: string | null;
          role?: UserRole;
          updated_at?: string | null;
        };
      };
    };
  };
}