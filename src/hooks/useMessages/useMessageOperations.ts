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
        .single();

      if (!profile) {
        toast.error('User profile not found');
        return false;
      }

      // For regular users, use their own ID as user_id
      // For admin users, use the patientId parameter
      const messageUserId = profile.role === 'admin' ? patientId : profile.id;

      if (!messageUserId) {
        toast.error('Could not determine message recipient');
        return false;
      }

      // Create optimistic message
      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        content,
        user_id: messageUserId,
        is_from_doctor: profile.role === 'admin',
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_type: fileData?.type,
        status: 'not_seen',
        created_at: new Date().toISOString()
      };

      // Add optimistic message to UI
      setMessages(prev => [...prev, optimisticMessage]);

      // Send message to database
      const { error: insertError, data: insertedMessage } = await supabase
        .from('messages')
        .insert([{
          content,
          user_id: messageUserId,
          is_from_doctor: profile.role === 'admin',
          file_url: fileData?.url,
          file_name: fileData?.name,
          file_type: fileData?.type,
          status: 'not_seen'
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error sending message:', insertError);
        // Remove optimistic message if there was an error
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        toast.error('Failed to send message');
        return false;
      }

      // Replace optimistic message with actual message from database
      if (insertedMessage) {
        setMessages(prev => prev.map(msg => 
          msg.id === optimisticMessage.id ? insertedMessage : msg
        ));
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