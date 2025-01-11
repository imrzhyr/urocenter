export type CallStatus = 'ringing' | 'connected' | 'ended' | 'initiated' | 'missed' | 'rejected';

export interface Call {
  id: string;
  caller_id: string;
  receiver_id: string;
  status: CallStatus;
  started_at?: string;
  ended_at?: string;
  duration?: number;
  created_at?: string;
}

export interface CallingUser {
  full_name: string;
  id: string;
  name?: string; // Adding this for backward compatibility
}