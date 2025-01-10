import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/profile";
import { toast } from "sonner";
import { useProfile } from "./useProfile";
import { useNavigate } from "react-router-dom";

export const useChat = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const navigate = useNavigate();

  const fetchMessages = async () => {
    if (!userId) {
      console.log('No userId provided to useChat');
      return;
    }
    
    try {
      console.log('Fetching messages for userId:', userId);
      
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }

      console.log('Fetched messages:', messages);
      setMessages(messages || []);

      // Mark messages as seen if they're from the other party
      const unseenMessages = messages?.filter(m => 
        !m.seen_at && 
        ((profile?.role === 'admin' && !m.is_from_doctor) || 
         (profile?.role !== 'admin' && m.is_from_doctor))
      ) || [];

      if (unseenMessages.length > 0) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ 
            seen_at: new Date().toISOString(),
            status: 'seen',
            delivered_at: new Date().toISOString()
          })
          .in('id', unseenMessages.map(m => m.id));

        if (updateError) {
          console.error('Error marking messages as seen:', updateError);
        }
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (
    content: string,
    fileInfo?: { url: string; name: string; type: string; duration?: number }
  ) => {
    if (!userId || !profile?.id) {
      toast.error("Unable to send message");
      return;
    }

    try {
      setIsLoading(true);

      const messageData = {
        content: content.trim(),
        user_id: userId,
        is_from_doctor: profile.role === 'admin',
        status: 'not_seen',
        file_url: fileInfo?.url,
        file_name: fileInfo?.name,
        file_type: fileInfo?.type,
        duration: fileInfo?.duration,
        sender_name: profile.full_name || 'Unknown User'
      };

      console.log('Sending message:', messageData);

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      await fetchMessages();
      return data as Message;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to message updates
    const messageChannel = supabase
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
          await fetchMessages();
        }
      )
      .subscribe();

    // Subscribe to call notifications for both caller and receiver
    const callChannel = supabase
      .channel(`calls_${profile?.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `or(caller_id.eq.${profile?.id},receiver_id.eq.${profile?.id})`
        },
        (payload) => {
          console.log('Call notification received:', payload);
          
          if (payload.eventType === 'INSERT' && payload.new.receiver_id === profile?.id) {
            // Show notification for incoming call
            if ('Notification' in window) {
              if (Notification.permission === 'granted') {
                const notification = new Notification('Incoming Call', {
                  body: 'Someone is calling you',
                  icon: '/favicon.ico',
                  requireInteraction: true
                });

                notification.onclick = () => {
                  window.focus();
                  navigate(`/call/${payload.new.caller_id}`);
                };
              } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    const notification = new Notification('Incoming Call', {
                      body: 'Someone is calling you',
                      icon: '/favicon.ico',
                      requireInteraction: true
                    });

                    notification.onclick = () => {
                      window.focus();
                      navigate(`/call/${payload.new.caller_id}`);
                    };
                  }
                });
              }
            }

            // Show toast notification
            toast.info('Incoming call...', {
              action: {
                label: 'Answer',
                onClick: () => navigate(`/call/${payload.new.caller_id}`)
              },
              duration: 10000
            });

            // Automatically navigate to call page
            navigate(`/call/${payload.new.caller_id}`);
          }
        }
      )
      .subscribe();

    // Request notification permission on component mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Cleaning up subscriptions');
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(callChannel);
    };
  }, [userId, profile?.id, navigate]);

  return {
    messages,
    isLoading,
    sendMessage,
    refreshMessages: fetchMessages
  };
};