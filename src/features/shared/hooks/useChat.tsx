import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/profile';
import { toast } from 'sonner';

export const useChat = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${userId}`
      }, payload => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const sendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string }) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            user_id: userId,
            content,
            file_url: fileInfo?.url,
            file_name: fileInfo?.name,
            file_type: fileInfo?.type
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  };

  return { messages, isLoading, sendMessage };
};