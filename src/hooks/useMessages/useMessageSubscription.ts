import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

export const useMessageSubscription = (
  patientId: string | undefined,
  onNewMessage: (message: Message) => void
) => {
  useEffect(() => {
    if (!patientId) return;

    const channel = supabase
      .channel(`messages:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${patientId}`
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            onNewMessage(payload.new as Message);
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
  }, [patientId, onNewMessage]);
};