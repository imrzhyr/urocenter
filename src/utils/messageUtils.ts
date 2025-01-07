import { PatientMessage } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";

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
  const userMessages = messagesData?.reduce((acc: { [key: string]: PatientMessage }, message) => {
    const userId = message.user_id;
    
    if (!acc[userId] || new Date(message.created_at) > new Date(acc[userId].last_message_time)) {
      // Count unread messages for this user
      const unreadCount = messagesData.filter(
        msg => msg.user_id === userId && !msg.is_read
      ).length;

      acc[userId] = {
        id: userId,
        full_name: message.profiles?.full_name || "Unknown Patient",
        last_message: message.content,
        last_message_time: message.created_at,
        status: message.status,
        unread_count: unreadCount
      };
    }
    return acc;
  }, {});

  return Object.values(userMessages || {});
};