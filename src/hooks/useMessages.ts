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
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) {
          console.error('No user phone found in localStorage');
          return;
        }

        await messageService.setUserContext(userPhone);
        const fetchedMessages = await messageService.fetchMessages(userId);
        console.log('Fetched messages:', fetchedMessages);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error in fetchMessages:', error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

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
            setMessages(prev => {
              const messageExists = prev.some(msg => msg.id === newMessage.id);
              return messageExists ? prev : [...prev, newMessage];
            });

            if (newMessage.is_from_doctor) {
              await supabase
                .from('messages')
                .update({ 
                  delivered_at: new Date().toISOString(),
                  status: 'not_seen'
                })
                .eq('id', newMessage.id);
            }
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
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) throw new Error('No user phone found');

      await messageService.setUserContext(userPhone);
      const newMessage = await messageService.sendMessage(content, userId, isFromDoctor, fileInfo);
      console.log('Message sent successfully:', newMessage);
      
      return newMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
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