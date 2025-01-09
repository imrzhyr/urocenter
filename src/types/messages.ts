export type MessageStatus = 'not_seen' | 'seen' | 'in_progress' | 'resolved';

export interface PatientMessage {
  id: string;
  full_name: string;
  last_message: string;
  last_message_time: string;
  status: MessageStatus;
  unread_count: number;
  duration?: number;
  is_resolved?: boolean;
}