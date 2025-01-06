export interface MedicalReport {
  created_at: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  id: string;
  user_id: string;
}

export interface MedicalReportInsert {
  created_at?: string;
  file_name: string;
  file_path: string;
  file_type?: string | null;
  id?: string;
  user_id: string;
}

export interface MedicalReportUpdate {
  created_at?: string;
  file_name?: string;
  file_path?: string;
  file_type?: string | null;
  id?: string;
  user_id?: string;
}