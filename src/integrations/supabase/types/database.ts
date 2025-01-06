import { Json, UserRole } from './common';
import { MedicalReport, MedicalReportInsert, MedicalReportUpdate } from './medical-reports';
import { Message, MessageInsert, MessageUpdate } from './messages';
import { Profile, ProfileInsert, ProfileUpdate } from './profiles';
import { Functions } from './functions';

export type Database = {
  public: {
    Tables: {
      medical_reports: {
        Row: MedicalReport;
        Insert: MedicalReportInsert;
        Update: MedicalReportUpdate;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
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