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

export const useMessages = (patientId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) return;

        // Set user context
        await supabase.rpc('set_user_context', { user_phone: userPhone });

        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
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
            setMessages(prev => [...prev, payload.new as Message].sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            ));
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => msg.id === payload.new.id ? payload.new as Message : msg)
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
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

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('phone', userPhone)
        .single();

      if (!profile) {
        toast.error('User profile not found');
        return false;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          user_id: profile.id,
          is_from_doctor: profile.role === 'admin',
          file_url: fileData?.url,
          file_name: fileData?.name,
          file_type: fileData?.type,
          status: 'not_seen'
        });

      if (error) throw error;
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