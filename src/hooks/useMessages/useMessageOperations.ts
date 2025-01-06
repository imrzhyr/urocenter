import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message, FileData } from './types';

export const useMessageOperations = (patientId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = async (content: string, fileData?: FileData) => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      toast.error('Please sign in to send messages');
      return false;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('phone', userPhone)
        .maybeSingle();

      if (!profile) {
        toast.error('User profile not found');
        return false;
      }

      const newMessage = {
        content,
        user_id: patientId || profile.id,
        is_from_doctor: profile.role === 'admin',
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_type: fileData?.type,
        created_at: new Date().toISOString(),
        status: 'not_seen'
      };

      const optimisticMessage = { ...newMessage, id: crypto.randomUUID() };
      setMessages(prev => [...prev, optimisticMessage]);

      const { error: insertError } = await supabase
        .from('messages')
        .insert([newMessage]);

      if (insertError) {
        console.error('Error sending message:', insertError);
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        toast.error('Failed to send message');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  return {
    messages,
    setMessages,
    addMessage
  };
};