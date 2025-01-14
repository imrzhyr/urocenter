export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          gender: string | null;
          age: string | null;
          complaint: string | null;
          created_at: string | null;
          updated_at: string | null;
          auth_method: string | null;
          last_login: string | null;
          password: string;
          role: 'admin' | 'patient';
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          gender?: string | null;
          age?: string | null;
          complaint?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          auth_method?: string | null;
          last_login?: string | null;
          password: string;
          role?: 'admin' | 'patient';
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          gender?: string | null;
          age?: string | null;
          complaint?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          auth_method?: string | null;
          last_login?: string | null;
          password?: string;
          role?: 'admin' | 'patient';
        };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          is_from_doctor: boolean | null;
          is_read: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          file_url: string | null;
          file_name: string | null;
          file_type: string | null;
          status: string;
          delivered_at: string | null;
          seen_at: string | null;
          duration: number | null;
          is_resolved: boolean | null;
          sender_name: string | null;
          replyTo: {
            content: string;
            file_type?: string | null;
            file_url?: string | null;
            sender_name?: string;
          } | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          is_from_doctor?: boolean | null;
          is_read?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          file_url?: string | null;
          file_name?: string | null;
          file_type?: string | null;
          status?: string;
          delivered_at?: string | null;
          seen_at?: string | null;
          duration?: number | null;
          is_resolved?: boolean | null;
          sender_name?: string | null;
          replyTo?: {
            content: string;
            file_type?: string | null;
            file_url?: string | null;
            sender_name?: string;
          } | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          is_from_doctor?: boolean | null;
          is_read?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          file_url?: string | null;
          file_name?: string | null;
          file_type?: string | null;
          status?: string;
          delivered_at?: string | null;
          seen_at?: string | null;
          duration?: number | null;
          is_resolved?: boolean | null;
          sender_name?: string | null;
          replyTo?: {
            content: string;
            file_type?: string | null;
            file_url?: string | null;
            sender_name?: string;
          } | null;
        };
      };
      medical_reports: {
        Row: {
          id: string;
          user_id: string;
          file_path: string;
          file_name: string;
          file_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_path: string;
          file_name: string;
          file_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_path?: string;
          file_name?: string;
          file_type?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "admin" | "patient";
    };
  };
}