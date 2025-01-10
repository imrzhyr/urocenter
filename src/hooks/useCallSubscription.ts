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

    // Create a unique channel for this user's calls
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

          if (payload.eventType === 'INSERT') {
            console.log('New call detected:', payload.new);
            
            // Only show notification for active calls where we're the receiver
            if (payload.new.status === 'active' && payload.new.receiver_id === profile.id) {
              console.log('Incoming call detected, showing notifications');
              
              // Get caller details
              const { data: callerData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', payload.new.caller_id)
                .single();
              
              const callerName = callerData?.full_name || 'Someone';

              // Show browser notification
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

              // Show persistent toast notification
              toast.info(
                `${callerName} is calling...`,
                {
                  action: {
                    label: 'Answer',
                    onClick: () => navigate(`/call/${payload.new.caller_id}`)
                  },
                  duration: Infinity, // Toast will stay until user takes action
                  onDismiss: () => {
                    // Update call status to rejected if dismissed
                    supabase
                      .from('calls')
                      .update({ status: 'rejected' })
                      .eq('id', payload.new.id);
                  }
                }
              );
            }
          } else if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new.status;
            console.log('Call status updated to:', newStatus);

            if (newStatus === 'accepted') {
              onCallAccepted();
              toast.success('Call connected');
            } else if (newStatus === 'ended' || newStatus === 'rejected') {
              onCallEnded();
              toast.info(newStatus === 'ended' ? 'Call ended' : 'Call rejected');
              
              // Navigate away from call page if we're on it
              if (window.location.pathname.includes('/call/')) {
                navigate(-1);
              }
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Call subscription status:', status);
      });

    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Cleaning up call subscription');
      supabase.removeChannel(channel);
    };
  }, [profile?.id, navigate, onCallAccepted, onCallEnded]);
};