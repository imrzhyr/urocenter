import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/profile";

export const useMessages = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          console.error('No active session');
          return;
        }

        console.log('Fetching messages for user:', userId);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          if (error.code === '42501') {
            toast.error("Authorization error. Please sign in again.");
          } else {
            toast.error("Failed to load messages");
          }
          return;
        }

        console.log('Fetched messages:', data);
        setMessages(data as Message[]);
        await markMessagesAsSeen(data);
      } catch (error) {
        console.error('Error in fetchMessages:', error);
        toast.error("Failed to load messages");
      }
    };

    const markMessagesAsSeen = async (messages: Message[]) => {
      try {
        const unseenMessages = messages?.filter(m => !m.seen_at && m.is_from_doctor) || [];
        if (unseenMessages.length > 0) {
          const { error: updateError } = await supabase
            .from('messages')
            .update({ 
              seen_at: new Date().toISOString(),
              status: 'seen'
            })
            .in('id', unseenMessages.map(m => m.id));

          if (updateError) {
            console.error('Error marking messages as seen:', updateError);
          }
        }
      } catch (error) {
        console.error('Error in markMessagesAsSeen:', error);
      }
    };

    fetchMessages();

    // Enable REPLICA IDENTITY FULL for the messages table
    const channel = supabase
      .channel(`messages_${userId}`)
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
            setMessages(prev => [...prev, newMessage]);
            
            if (newMessage.is_from_doctor) {
              await markMessageAsDelivered(newMessage.id);
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
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markMessageAsDelivered = async (messageId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ 
          delivered_at: new Date().toISOString(),
          status: 'delivered'
        })
        .eq('id', messageId);

      if (updateError) {
        console.error('Error marking message as delivered:', updateError);
      }
    } catch (error) {
      console.error('Error in markMessageAsDelivered:', error);
    }
  };

  const sendMessage = async (content: string, userId: string, isFromDoctor: boolean = false) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Please sign in to send messages");
        return;
      }

      setIsLoading(true);
      console.log('Sending message:', { content, userId, isFromDoctor });
      
      const { error } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          user_id: userId,
          is_from_doctor: isFromDoctor,
          status: 'sent'
        });

      if (error) {
        console.error('Error sending message:', error);
        if (error.code === '42501') {
          toast.error("Authorization error. Please sign in again.");
        } else {
          toast.error("Failed to send message");
        }
        throw error;
      }

      toast.success("Message sent");
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast.error("Failed to send message");
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