export type CallStatus = 'initiated' | 'ringing' | 'connected' | 'ended' | 'missed';

export interface Call {
  id: string;
  caller_id: string;
  receiver_id: string;
  status: CallStatus;
  started_at: string;
  ended_at?: string;
  duration?: number;
  call_type: 'audio' | 'video';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}