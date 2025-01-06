import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/integrations/supabase/types/messages";
import { sortMessagesByDate } from '@/utils/messageUtils';

export const fetchMessages = async (userPhone: string): Promise<Message[]> => {
  await supabase.rpc('set_user_context', { user_phone: userPhone });

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return sortMessagesByDate(messages || []);
};

export const sendMessage = async (
  content: string,
  userPhone: string,
  fileData?: { url: string; name: string; type: string }
) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('phone', userPhone)
    .single();

  if (!profile) {
    throw new Error('User profile not found');
  }

  const newMessage = {
    content,
    user_id: profile.id,
    is_from_doctor: profile.role === 'admin',
    file_url: fileData?.url,
    file_name: fileData?.name,
    file_type: fileData?.type,
    status: 'not_seen'
  };

  const { error } = await supabase
    .from('messages')
    .insert(newMessage);

  if (error) throw error;
  return { newMessage, profile };
};

export const markMessageAsResolved = async (messageId: string) => {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'resolved' })
    .eq('id', messageId);

  if (error) throw error;
};