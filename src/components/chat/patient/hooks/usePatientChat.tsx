import { useState, useCallback } from 'react';
import { Message } from '@/types/profile';
import { chatService } from '@/services/api/chat';
import { toast } from "sonner";
import { useProfile } from '@/hooks/useProfile';

export const usePatientChat = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();

  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const messages = await chatService.fetchMessages(userId);
      setMessages(messages);

      const unseenMessages = messages.filter(m => !m.seen_at);
      if (unseenMessages.length > 0) {
        await chatService.markMessagesAsSeen(userId, unseenMessages.map(m => m.id));
      }
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const sendMessage = useCallback(async (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => {
    if (!userId || !profile) {
      toast.error("Unable to send message");
      return;
    }

    try {
      setIsLoading(true);
      const message = await chatService.sendMessage({
        content: content.trim(),
        user_id: userId,
        file_url: fileInfo?.url,
        file_name: fileInfo?.name,
        file_type: fileInfo?.type,
        duration: fileInfo?.duration,
        status: 'not_seen'
      });

      setMessages(prev => [...prev, message]);
      return message;
    } catch (error) {
      toast.error("Failed to send message");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId, profile]);

  return {
    messages,
    isLoading,
    sendMessage,
    fetchMessages
  };
};