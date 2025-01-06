import { Message } from "@/integrations/supabase/types/messages";

export const sortMessagesByDate = (messages: Message[]) => {
  return [...messages].sort((a, b) => 
    new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
  );
};

export const createOptimisticMessage = (
  content: string, 
  userId: string, 
  isFromDoctor: boolean,
  fileData?: { url: string; name: string; type: string }
): Message => ({
  id: 'temp-' + Date.now(),
  content,
  user_id: userId,
  is_from_doctor: isFromDoctor,
  is_read: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(), // Added the missing updated_at field
  file_url: fileData?.url || null,
  file_name: fileData?.name || null,
  file_type: fileData?.type || null,
  status: 'not_seen'
});