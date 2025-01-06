import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/integrations/supabase/types/messages";
import { sortMessagesByDate } from '@/utils/messageUtils';

export const fetchMessages = async (userPhone: string): Promise<Message[]> => {
  await supabase.rpc('set_user_context', { user_phone: userPhone });

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  return sortMessagesByDate(messages || []);
};

export const sendMessage = async (
  content: string,
  userPhone: string,
  fileData?: { url: string; name: string; type: string }
) => {
  // First set the user context
  await supabase.rpc('set_user_context', { user_phone: userPhone });

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('phone', userPhone)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    throw profileError;
  }

  if (!profile) {
    throw new Error('User profile not found');
  }

  const messageData = {
    content,
    user_id: profile.id,
    is_from_doctor: profile.role === 'admin',
    file_url: fileData?.url || null,
    file_name: fileData?.name || null,
    file_type: fileData?.type || null,
    status: 'not_seen',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: newMessage, error: insertError } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting message:', insertError);
    throw insertError;
  }

  return { newMessage, profile };
};

export const markMessageAsResolved = async (messageId: string) => {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'resolved', updated_at: new Date().toISOString() })
    .eq('id', messageId);

  if (error) {
    console.error('Error marking message as resolved:', error);
    throw error;
  }
};