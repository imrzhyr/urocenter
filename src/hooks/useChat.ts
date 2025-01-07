import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/profile";
import { toast } from "sonner";

export const useChat = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const setUserContext = async (userPhone: string) => {
    try {
      console.log('Setting user context for:', userPhone);
      const { error } = await supabase.rpc('set_user_context', { 
        user_phone: userPhone 
      });
      
      if (error) {
        console.error('Error setting user context:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error setting user context:', error);
      throw error;
    }
  };

  const fetchMessages = async () => {
    if (!userId) return;
    
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) throw new Error('No user phone found');

      await setUserContext(userPhone);
      console.log('Fetching messages for userId:', userId);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('phone', userPhone)
        .maybeSingle();

      if (!profileData) {
        throw new Error('Profile not found');
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('Fetched messages:', data);
      setMessages(data || []);

      // Mark messages as seen if they're from doctor
      const unseenMessages = data?.filter(m => !m.seen_at && m.is_from_doctor) || [];
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
      console.error('Error fetching messages:', error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (
    content: string,
    fileInfo?: { url: string; name: string; type: string }
  ) => {
    if (!userId) {
      toast.error("Unable to send message. Please try signing in again.");
      return;
    }

    try {
      setIsLoading(true);
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) throw new Error('No user phone found');

      await setUserContext(userPhone);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('phone', userPhone)
        .maybeSingle();

      if (!profileData) {
        throw new Error('Profile not found');
      }

      const messageData = {
        content: content.trim(),
        user_id: userId,
        is_from_doctor: profileData.role === 'admin',
        status: 'not_seen',
        file_url: fileInfo?.url,
        file_name: fileInfo?.name,
        file_type: fileInfo?.type
      };

      console.log('Sending message:', messageData);

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      toast.success("Message sent successfully");
      return data as Message;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
            setMessages(prev => {
              const messageExists = prev.some(msg => msg.id === newMessage.id);
              return messageExists ? prev : [...prev, newMessage];
            });

            // Mark message as delivered if it's from doctor
            if (newMessage.is_from_doctor) {
              await supabase
                .from('messages')
                .update({ 
                  delivered_at: new Date().toISOString(),
                  status: 'delivered'
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

  return {
    messages,
    isLoading,
    sendMessage,
    refreshMessages: fetchMessages
  };
};