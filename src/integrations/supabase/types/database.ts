import { Json, UserRole } from './common';
import { MedicalReport, MedicalReportInsert, MedicalReportUpdate } from './medical-reports';
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
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
    };
    Functions: Functions;
    Enums: {
      user_role: UserRole;
    };
  };
};