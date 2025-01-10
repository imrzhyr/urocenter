export interface User {
  id: string;
  fullName?: string;
  phone?: string;
  email?: string;
  role?: 'patient' | 'doctor' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice' | 'video';
  fileUrl?: string;
}

export interface Profile {
  id: string;
  fullName?: string;
  phone?: string;
  gender?: string;
  age?: string;
  complaint?: string;
  role?: 'patient' | 'doctor' | 'admin';
}

export interface MedicalReport {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  createdAt: string;
}