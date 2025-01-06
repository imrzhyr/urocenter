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

  useEffect(() => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      console.error('No user phone found');
      return;
    }

    // Set up user context
    const setupUserContext = async () => {
      const { error } = await supabase.rpc('set_user_context', {
        user_phone: userPhone
      });
      if (error) console.error('Error setting user context:', error);
    };

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        await setupUserContext();
        
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        toast.error('Error loading messages');
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
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to messages');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { messages };
};