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

    // Set up real-time subscription
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as Message]);
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => msg.id === payload.new.id ? payload.new as Message : msg)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { messages };
};