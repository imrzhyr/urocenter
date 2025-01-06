import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/integrations/supabase/types/messages";
import { sortMessagesByDate } from '@/utils/messageUtils';

export const useMessageSubscription = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  useEffect(() => {
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
          console.log('Real-time update received:', payload);
          if (payload.eventType === 'INSERT') {
            setMessages(prev => sortMessagesByDate([...prev, payload.new as Message]));
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              sortMessagesByDate(prev.map(msg => 
                msg.id === payload.new.id ? payload.new as Message : msg
              ))
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        }
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [setMessages]);
};