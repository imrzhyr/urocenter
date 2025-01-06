export type UserRole = 'admin' | 'patient';

export interface Profile {
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
}

export interface ProfileInsert {
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
}

export interface ProfileUpdate {
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
}