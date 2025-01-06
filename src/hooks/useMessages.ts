import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RealtimeChannel } from "@supabase/supabase-js";

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

  useEffect(() => {
    let channel: RealtimeChannel;
    
    const fetchMessages = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        console.error('No user phone found');
        return;
      }

      try {
        // Set up user context
        const { error: contextError } = await supabase.rpc('set_user_context', {
          user_phone: userPhone
        });
        
        if (contextError) {
          console.error('Error setting user context:', contextError);
          return;
        }

        // Fetch initial messages
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        console.log('Initial messages loaded:', data);
        setMessages(data || []);

        // Set up real-time subscription
        channel = supabase
          .channel('messages-channel')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'messages'
            },
            (payload) => {
              console.log('Real-time update received:', payload);
              
              if (payload.eventType === 'INSERT') {
                setMessages((prev) => [...prev, payload.new as Message]);
              } else if (payload.eventType === 'DELETE') {
                setMessages((prev) => prev.filter(msg => msg.id !== payload.old.id));
              } else if (payload.eventType === 'UPDATE') {
                setMessages((prev) => 
                  prev.map(msg => msg.id === payload.new.id ? payload.new as Message : msg)
                );
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to messages');
            }
          });

      } catch (error: any) {
        console.error('Error in useMessages:', error);
        toast.error('Error loading messages');
      }
    };

    fetchMessages();

    return () => {
      if (channel) {
        console.log('Cleaning up subscription');
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { messages };
};