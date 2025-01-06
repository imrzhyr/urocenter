import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  is_from_doctor: boolean;
  file_url?: string;
  file_name?: string;
  file_type?: string;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Error loading messages');
        return;
      }

      setMessages(messages || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMessages();

    // Enable realtime for the messages table
    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setMessages((currentMessages) => [...currentMessages, payload.new as Message]);
          } else if (payload.eventType === 'DELETE') {
            setMessages((currentMessages) => 
              currentMessages.filter(msg => msg.id !== payload.old.id)
            );
          } else if (payload.eventType === 'UPDATE') {
            setMessages((currentMessages) => 
              currentMessages.map(msg => 
                msg.id === payload.new.id ? payload.new as Message : msg
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to messages changes');
        }
      });

    // Cleanup subscription
    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return { messages };
};