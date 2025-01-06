import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

export const useMessageSubscription = (
  patientId: string | undefined,
  onNewMessage: (message: Message) => void
) => {
  useEffect(() => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) return;

    const setupSubscription = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('phone', userPhone)
          .single();

        if (!profile) return;

        const channelId = profile.role === 'admin' 
          ? patientId 
            ? `admin_messages_${patientId}`
            : 'admin_all_messages'
          : `user_messages_${profile.id}`;

        const channel = supabase
          .channel(channelId)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: profile.role === 'admin'
                ? patientId ? `user_id=eq.${patientId}` : undefined
                : `user_id=eq.${profile.id}`
            },
            (payload) => {
              console.log('New message received:', payload);
              onNewMessage(payload.new as Message);
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
          });

        return () => {
          console.log('Cleaning up subscription');
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error setting up subscription:', error);
      }
    };

    const cleanup = setupSubscription();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [patientId, onNewMessage]);
};