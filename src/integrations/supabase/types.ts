export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      call_signals: {
        Row: {
          call_id: string
          created_at: string | null
          data: Json
          from_user: string
          id: string
          to_user: string
          type: Database["public"]["Enums"]["signal_type"]
        }
        Insert: {
          call_id: string
          created_at?: string | null
          data: Json
          from_user: string
          id?: string
          to_user: string
          type: Database["public"]["Enums"]["signal_type"]
        }
        Update: {
          call_id?: string
          created_at?: string | null
          data?: Json
          from_user?: string
          id?: string
          to_user?: string
          type?: Database["public"]["Enums"]["signal_type"]
        }
        Relationships: [
          {
            foreignKeyName: "call_signals_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_signals_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_signals_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          caller_id: string
          created_at: string | null
          ended_at: string | null
          id: string
          receiver_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["call_status"]
        }
        Insert: {
          caller_id: string
          created_at?: string | null
          ended_at?: string | null
          id?: string
          receiver_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"]
        }
        Update: {
          caller_id?: string
          created_at?: string | null
          ended_at?: string | null
          id?: string
          receiver_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"]
        }
        Relationships: [
          {
            foreignKeyName: "calls_caller_id_fkey"
            columns: ["caller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_reports: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_type: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_type?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          delivered_at: string | null
          duration: number | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_from_doctor: boolean | null
          is_read: boolean | null
          is_resolved: boolean | null
          referenced_message: Json | null
          replyTo: Json | null
          seen_at: string | null
          sender_name: string | null
          status: string
          typing_users: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          delivered_at?: string | null
          duration?: number | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_from_doctor?: boolean | null
          is_read?: boolean | null
          is_resolved?: boolean | null
          referenced_message?: Json | null
          replyTo?: Json | null
          seen_at?: string | null
          sender_name?: string | null
          status?: string
          typing_users?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          delivered_at?: string | null
          duration?: number | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_from_doctor?: boolean | null
          is_read?: boolean | null
          is_resolved?: boolean | null
          referenced_message?: Json | null
          replyTo?: Json | null
          seen_at?: string | null
          sender_name?: string | null
          status?: string
          typing_users?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: string | null
          complaint: string | null
          created_at: string | null
          full_name: string | null
          gender: string | null
          id: string
          payment_approval_status: string | null
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          age?: string | null
          complaint?: string | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          payment_approval_status?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          age?: string | null
          complaint?: string | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          payment_approval_status?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      rls_policies: {
        Row: {
          command: unknown | null
          policy_expression: string | null
          policy_name: unknown | null
          schema_name: unknown | null
          table_name: unknown | null
        }
        Relationships: []
      }
      rls_status: {
        Row: {
          hasrls: boolean | null
          schemaname: unknown | null
          tablename: unknown | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          schema_name: string
          table_name: string
          policy_name: string
          command: string
          policy_expression: string
        }[]
      }
      check_rls_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          schemaname: string
          tablename: string
          hasrls: boolean
        }[]
      }
      create_user_profile: {
        Args: {
          p_user_id: string
          p_phone: string
          p_role: string
        }
        Returns: undefined
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_admin_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_patients: number
          total_messages: number
          unread_messages: number
          resolved_chats: number
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_user_context:
        | {
            Args: Record<PropertyKey, never>
            Returns: undefined
          }
        | {
            Args: {
              user_phone: string
            }
            Returns: undefined
          }
      verify_rls: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          rls_enabled: boolean
          policies_count: number
          policies: string[]
        }[]
      }
    }
    Enums: {
      call_status: "pending" | "active" | "ended" | "missed" | "rejected"
      signal_type:
        | "offer"
        | "answer"
        | "candidate"
        | "leave"
        | "end_call"
        | "call_accepted"
      user_role: "admin" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
