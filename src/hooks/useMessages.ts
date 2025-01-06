import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  user_id: string;
  is_from_doctor: boolean;
  is_read: boolean;
  created_at: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  status: string;
}

const sortMessagesByDate = (messages: Message[]) => {
  return [...messages].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
};

export const useMessages = (patientId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) return;

        await supabase.rpc('set_user_context', { user_phone: userPhone });

        const { data: fetchedMessages, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(sortMessagesByDate(fetchedMessages || []));
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          if (payload.eventType === 'INSERT') {
            setMessages(prev => sortMessagesByDate([...prev, payload.new as Message]));
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              sortMessagesByDate(prev.map(msg => 
                msg.id === payload.new.id ? payload.new as Message : msg
              ))
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        }
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  const addMessage = async (content: string, fileData?: { url: string; name: string; type: string }) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error('Please sign in to send messages');
        return false;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('phone', userPhone)
        .single();

      if (!profile) {
        toast.error('User profile not found');
        return false;
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

      // Optimistically add the message to the local state
      setMessages(prev => sortMessagesByDate([
        ...prev,
        {
          ...newMessage,
          id: 'temp-' + Date.now(), // This will be replaced by the real ID when the real-time update arrives
          created_at: new Date().toISOString(),
          is_read: false
        } as Message
      ]));

      return true;
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  const markAsResolved = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'resolved' })
        .eq('id', messageId);

      if (error) throw error;
      toast.success('Message marked as resolved');
    } catch (error) {
      console.error('Error marking message as resolved:', error);
      toast.error('Failed to update message status');
    }
  };

  return {
    messages,
    isLoading,
    addMessage,
    markAsResolved
  };
};