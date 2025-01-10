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

    // Create a channel specifically for incoming calls
    const incomingChannel = supabase
      .channel(`incoming_calls_${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${profile.id}`,
        },
        async (payload) => {
          console.log('Received call update for receiver:', payload);

          if (payload.eventType === 'INSERT') {
            // Only handle active calls where we're the receiver
            if (payload.new.status === 'active' && payload.new.receiver_id === profile.id) {
              console.log('New incoming call detected:', payload.new);
              
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
                  duration: Infinity,
                  onDismiss: () => {
                    supabase
                      .from('calls')
                      .update({ status: 'rejected' })
                      .eq('id', payload.new.id);
                  }
                }
              );
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Incoming calls subscription status:', status);
      });

    // Create a separate channel for call status updates
    const statusChannel = supabase
      .channel(`call_status_${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'calls',
          filter: `or(caller_id=eq.${profile.id},receiver_id=eq.${profile.id})`,
        },
        (payload) => {
          console.log('Call status update:', payload);
          
          const newStatus = payload.new.status;
          if (newStatus === 'accepted') {
            onCallAccepted();
            toast.success('Call connected');
          } else if (newStatus === 'ended' || newStatus === 'rejected') {
            onCallEnded();
            toast.info(newStatus === 'ended' ? 'Call ended' : 'Call rejected');
            
            if (window.location.pathname.includes('/call/')) {
              navigate(-1);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Call status subscription status:', status);
      });

    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Cleaning up call subscriptions');
      supabase.removeChannel(incomingChannel);
      supabase.removeChannel(statusChannel);
    };
  }, [profile?.id, navigate, onCallAccepted, onCallEnded]);
};