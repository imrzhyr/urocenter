import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMessageOperations } from './useMessageOperations';
import { useMessageSubscription } from './useMessageSubscription';
import { Message } from './types';

export const useMessages = (patientId?: string) => {
  const { messages, setMessages, addMessage } = useMessageOperations(patientId);

  useEffect(() => {
    const fetchMessages = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('phone', userPhone)
          .single();

        if (!profile) return;

        let query = supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (profile.role === 'admin' && patientId) {
          query = query.eq('user_id', patientId);
        } else if (profile.role !== 'admin') {
          query = query.eq('user_id', profile.id);
        }

        const { data: messages, error } = await query;

        if (error) {
          console.error('Error fetching messages:', error);
          toast.error('Failed to load messages');
          return;
        }

        setMessages(messages || []);
      } catch (error) {
        console.error('Error in useMessages:', error);
        toast.error('Error loading messages');
      }
    };

    fetchMessages();
  }, [patientId, setMessages]);

  useMessageSubscription(patientId, (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  });

  return { messages, addMessage };
};

export type { Message, FileData } from './types';