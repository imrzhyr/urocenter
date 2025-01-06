import { Tables, TablesInsert, TablesUpdate } from './tables';
import { Functions } from './functions';

export type Database = {
  public: {
    Tables: {
      medical_reports: Tables<'medical_reports'>;
      messages: Tables<'messages'>;
      profiles: Tables<'profiles'>;
    };
    Functions: Functions;
    Views: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};