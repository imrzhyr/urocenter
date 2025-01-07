import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/profile";
import { messageService } from "@/services/messageService";

export const useMessages = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided to useMessages");
      return;
    }

    const fetchMessages = async () => {
      try {
        console.log('Fetching messages for userId:', userId);
        const fetchedMessages = await messageService.fetchMessages(userId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error in fetchMessages:', error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          console.log('Received real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            // Only add the message if it's not already in the state
            setMessages(prev => {
              const messageExists = prev.some(msg => msg.id === newMessage.id);
              return messageExists ? prev : [...prev, newMessage];
            });
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const sendMessage = async (
    content: string, 
    userId: string, 
    isFromDoctor: boolean = false,
    fileInfo?: { url: string; name: string; type: string }
  ) => {
    try {
      setIsLoading(true);
      const newMessage = await messageService.sendMessage(content, userId, isFromDoctor, fileInfo);
      console.log('Message sent successfully:', newMessage);
      // Add the new message to the local state immediately
      setMessages(prev => [...prev, newMessage]);
      toast.success("Message sent");
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast.error("Failed to send message");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
};