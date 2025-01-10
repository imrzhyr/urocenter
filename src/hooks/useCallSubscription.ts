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
    if (!profile?.id) return;

    console.log('Setting up call subscription for user:', profile.id);

    const channel = supabase
      .channel(`calls_${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${profile.id}`,
        },
        async (payload) => {
          console.log('Received call update:', payload);

          // Handle new incoming calls
          if (payload.eventType === 'INSERT' && payload.new.status === 'active') {
            console.log('New incoming call detected');
            
            // Only show notification if we're the receiver and not already on the call page
            if (payload.new.receiver_id === profile.id && !window.location.pathname.includes('/call/')) {
              if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification('Incoming Call', {
                  body: 'Someone is calling you',
                  icon: '/favicon.ico',
                  requireInteraction: true
                });

                notification.onclick = () => {
                  window.focus();
                  navigate(`/call/${payload.new.caller_id}`);
                };
              }

              toast.info('Incoming call...', {
                action: {
                  label: 'Answer',
                  onClick: () => navigate(`/call/${payload.new.caller_id}`)
                },
                duration: 10000
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new.status;
            console.log('Call status updated to:', newStatus);

            if (newStatus === 'accepted') {
              onCallAccepted();
            } else if (newStatus === 'ended') {
              onCallEnded();
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Call subscription status:', status);
      });

    // Request notification permission on component mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Cleaning up call subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, profile?.id, navigate, onCallAccepted, onCallEnded]);
};