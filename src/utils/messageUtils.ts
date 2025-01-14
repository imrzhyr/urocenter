import { PatientMessage, MessageStatus } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";

interface MessageWithProfile {
  id: string;
  content: string;
  created_at: string;
  status: string;
  is_read: boolean;
  user_id: string;
  is_from_doctor: boolean;
  profiles: {
    id: string;
    full_name: string | null;
  }[];
}

export const fetchPatientMessages = async (): Promise<PatientMessage[]> => {
  const { data: messagesData, error: messagesError } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      created_at,
      status,
      is_read,
      user_id,
      is_from_doctor,
      profiles (
        id,
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  if (messagesError) {
    console.error('Error fetching messages:', messagesError);
    throw messagesError;
  }

  // Group messages by user and get the latest message for each user
  const userMessages = messagesData?.reduce((acc: { [key: string]: PatientMessage }, message: MessageWithProfile) => {
    const userId = message.user_id;
    
    if (!acc[userId] || new Date(message.created_at) > new Date(acc[userId].last_message_time)) {
      // Count unread messages for this user (only from patient)
      const unreadCount = messagesData.filter(
        (msg: MessageWithProfile) => msg.user_id === userId && !msg.is_read && !msg.is_from_doctor
      ).length;

      const status = message.status as MessageStatus || 'not_seen';

      acc[userId] = {
        id: userId,
        full_name: message.profiles?.[0]?.full_name || "Unknown Patient",
        last_message: message.content,
        last_message_time: message.created_at,
        status,
        unread_count: unreadCount
      };
    }
    return acc;
  }, {});

  return Object.values(userMessages || {});
};