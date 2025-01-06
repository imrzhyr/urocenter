import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message, FileData } from './types';
import { setMessageContext, getUserProfile } from './useMessageContext';

export const useMessageOperations = (patientId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = async (content: string, fileData?: FileData): Promise<boolean> => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      toast.error('Please sign in to send messages');
      return false;
    }

    // Set user context first
    const contextSet = await setMessageContext(userPhone);
    if (!contextSet) {
      toast.error('Failed to set user context');
      return false;
    }

    // Get user profile
    const profile = await getUserProfile(userPhone);
    if (!profile) {
      toast.error('User profile not found');
      return false;
    }

    const messageUserId = patientId || profile.id;
    const timestamp = new Date().toISOString();
    const tempId = crypto.randomUUID();

    try {
      // Create optimistic message
      const optimisticMessage: Message = {
        id: tempId,
        content,
        user_id: messageUserId,
        is_from_doctor: profile.role === 'admin',
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_type: fileData?.type,
        status: 'not_seen',
        created_at: timestamp,
        updated_at: timestamp
      };

      // Add optimistic message
      setMessages(prev => [...prev, optimisticMessage]);

      // Send to database using upsert
      const { error: insertError } = await supabase
        .from('messages')
        .upsert([{
          ...optimisticMessage,
          id: undefined // Let database generate ID
        }]);

      if (insertError) {
        console.error('Error sending message:', insertError);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        toast.error('Failed to send message');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in addMessage:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
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