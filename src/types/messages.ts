export interface PatientMessage {
  id: string;
  full_name: string;
  last_message: string;
  last_message_time: string;
  status: MessageStatus;
  unread_count: number;
}

export type MessageStatus = 'not_seen' | 'in_progress' | 'resolved';