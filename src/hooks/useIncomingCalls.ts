import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useIncomingCalls = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile?.id) return;

    console.log('Setting up call subscription for user:', profile.id);

    const channel = supabase
      .channel('incoming_calls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${profile.id}`,
        },
        async (payload) => {
          console.log('Received new call:', payload);

          if (payload.new.status === 'initiated') {
            // Fetch caller details
            const { data: callerData, error: callerError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.caller_id)
              .single();

            if (callerError) {
              console.error('Error fetching caller details:', callerError);
              return;
            }

            const callerName = callerData?.full_name || 'Someone';

            // Show browser notification if permitted
            if ('Notification' in window && Notification.permission === 'granted') {
              const notification = new Notification('Incoming Call', {
                body: `${callerName} is calling you`,
                icon: '/favicon.ico',
                requireInteraction: true
              });
              
              notification.onclick = () => {
                window.focus();
                navigate(`/call/${payload.new.caller_id}`);
              };
            }

            // Show toast notification
            toast.info(
              `${callerName} is calling...`,
              {
                action: {
                  label: 'Answer',
                  onClick: () => navigate(`/call/${payload.new.caller_id}`)
                },
                duration: Infinity,
                onDismiss: async () => {
                  await supabase
                    .from('calls')
                    .update({ status: 'ended' })
                    .eq('id', payload.new.id);
                }
              }
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Call subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Call subscription active');
        }
      });

    // Also listen for call status changes
    const statusChannel = supabase
      .channel('call_status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${profile.id}`,
        },
        (payload) => {
          console.log('Call status updated:', payload);
          
          if (payload.new.status === 'ended') {
            toast.error('Call ended');
            if (window.location.pathname.includes('/call/')) {
              navigate(-1);
            }
          }
        }
      )
      .subscribe();

    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Cleaning up call subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(statusChannel);
    };
  }, [profile?.id, navigate]);
};