import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Message } from "@/integrations/supabase/types/messages";
import { useMessageSubscription } from './useMessageSubscription';
import { fetchMessages, sendMessage, markMessageAsResolved } from '@/services/messageService';
import { createOptimisticMessage } from '@/utils/messageUtils';

export const useMessages = (patientId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useMessageSubscription(setMessages);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) return;

        const fetchedMessages = await fetchMessages(userPhone);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [patientId]);

  const addMessage = async (content: string, fileData?: { url: string; name: string; type: string }) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error('Please sign in to send messages');
        return false;
      }

      const { newMessage, profile } = await sendMessage(content, userPhone, fileData);
      
      // Add optimistic message
      const optimisticMessage = createOptimisticMessage(
        content,
        profile.id,
        profile.role === 'admin',
        fileData
      );
      setMessages(prev => [...prev, optimisticMessage]);

      return true;
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  return {
    messages,
    isLoading,
    addMessage,
    markMessageAsResolved
  };
};