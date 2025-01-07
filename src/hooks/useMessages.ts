import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/profile";

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
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) {
          console.error('No user phone found in localStorage');
          return;
        }

        await supabase.rpc('set_user_context', { user_phone: userPhone });
        
        console.log('Fetching messages for user:', userId);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          toast.error("Failed to load messages");
          return;
        }

        console.log('Fetched messages:', data);
        setMessages(data as Message[]);
      } catch (error) {
        console.error('Error in fetchMessages:', error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

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
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const sendMessage = async (content: string, userId: string, isFromDoctor: boolean = false) => {
    console.log('sendMessage called with:', { content, userId, isFromDoctor });
    
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        console.error('No user phone found in localStorage');
        toast.error("Please sign in to send messages");
        return;
      }

      await supabase.rpc('set_user_context', { user_phone: userPhone });
      
      setIsLoading(true);
      
      const messageData = {
        content: content.trim(),
        user_id: userId,
        is_from_doctor: isFromDoctor,
        status: 'not_seen' // This is the correct status value that matches the check constraint
      };

      console.log('Inserting message:', messageData);
      
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        toast.error("Failed to send message");
        throw error;
      }

      console.log('Message sent successfully:', data);
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