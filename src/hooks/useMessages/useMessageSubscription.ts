import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

export const useMessageSubscription = (
  channelId: string,
  onNewMessage: (message: Message) => void
) => {
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${channelId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            onNewMessage(payload.new as Message);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, onNewMessage]);
};