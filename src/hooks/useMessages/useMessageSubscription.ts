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
      // Get user profile to determine if admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('phone', userPhone)
        .single();

      let channel;
      
      if (profile?.role === 'admin') {
        // Admin listens to all messages or specific patient messages
        channel = supabase
          .channel('admin_messages')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              ...(patientId ? { filter: `user_id=eq.${patientId}` } : {})
            },
            (payload) => {
              console.log('New message received:', payload);
              onNewMessage(payload.new as Message);
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
          });
      } else {
        // Regular users only listen to their own messages
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone', userPhone)
          .single();

        if (userProfile) {
          channel = supabase
            .channel(`user_messages_${userProfile.id}`)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `user_id=eq.${userProfile.id}`
              },
              (payload) => {
                console.log('New message received:', payload);
                onNewMessage(payload.new as Message);
              }
            )
            .subscribe((status) => {
              console.log('Subscription status:', status);
            });
        }
      }

      return () => {
        if (channel) {
          console.log('Cleaning up subscription');
          supabase.removeChannel(channel);
        }
      };
    };

    const cleanup = setupSubscription();
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [patientId, onNewMessage]);
};