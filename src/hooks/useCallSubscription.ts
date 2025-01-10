import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "./useProfile";
import { useNavigate } from "react-router-dom";

interface UseCallSubscriptionProps {
  userId: string;
  onCallAccepted: () => void;
  onCallEnded: () => void;
}

export const useCallSubscription = ({
  userId,
  onCallAccepted,
  onCallEnded,
}: UseCallSubscriptionProps) => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile?.id) {
      console.log('No profile ID available for call subscription');
      return;
    }

    console.log('Setting up call subscriptions for user:', profile.id);

    // Create a single channel for all call-related events
    const callChannel = supabase
      .channel(`calls_${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `or(receiver_id.eq.${profile.id},caller_id.eq.${profile.id})`,
        },
        async (payload) => {
          console.log('Received call event:', payload);

          // Handle new incoming calls
          if (payload.eventType === 'INSERT' && payload.new.receiver_id === profile.id) {
            console.log('New incoming call detected:', payload.new);
            
            // Get caller details
            const { data: callerData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.caller_id)
              .single();
            
            const callerName = callerData?.full_name || 'Someone';

            // Show browser notification if permitted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Incoming Call', {
                body: `${callerName} is calling you`,
                icon: '/favicon.ico',
                requireInteraction: true
              }).onclick = () => {
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
                    .update({ status: 'rejected' })
                    .eq('id', payload.new.id);
                }
              }
            );
          }

          // Handle call status updates
          if (payload.eventType === 'UPDATE') {
            console.log('Call status updated:', payload.new.status);
            
            switch (payload.new.status) {
              case 'accepted':
                onCallAccepted();
                toast.success('Call connected');
                break;
              case 'ended':
                onCallEnded();
                toast.info('Call ended');
                if (window.location.pathname.includes('/call/')) {
                  navigate(-1);
                }
                break;
              case 'rejected':
                onCallEnded();
                toast.info('Call rejected');
                if (window.location.pathname.includes('/call/')) {
                  navigate(-1);
                }
                break;
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Call subscription status:', status);
      });

    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Cleaning up call subscription');
      supabase.removeChannel(callChannel);
    };
  }, [profile?.id, navigate, onCallAccepted, onCallEnded]);
};