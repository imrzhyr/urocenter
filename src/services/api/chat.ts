import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/profile";
import { toast } from "sonner";

export const chatService = {
  async fetchMessages(userId: string) {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          replyTo,
          referenced_message
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return messages as Message[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async markMessagesAsSeen(userId: string, messageIds: string[]) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          seen_at: new Date().toISOString(),
          status: 'seen',
          delivered_at: new Date().toISOString()
        })
        .in('id', messageIds);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as seen:', error);
      throw error;
    }
  },

  async sendMessage(messageData: Partial<Message>) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};