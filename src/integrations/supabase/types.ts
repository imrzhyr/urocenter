// Base types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Database function return types
export type DbFunctionReturnTypes = {
  gen_random_uuid: {
    user_id: string;
  }[];
}

// Main Database type
export type Database = {
  public: {
    Tables: {
      medical_reports: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_type: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_type?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_from_doctor: boolean | null
          is_read: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_from_doctor?: boolean | null
          is_read?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_from_doctor?: boolean | null
          is_read?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: string | null
          auth_method: string | null
          complaint: string | null
          created_at: string | null
          full_name: string | null
          gender: string | null
          id: string
          last_login: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          age?: string | null
          auth_method?: string | null
          complaint?: string | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          last_login?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: string | null
          auth_method?: string | null
          complaint?: string | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          last_login?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: DbFunctionReturnTypes['gen_random_uuid']
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];