import { useEffect, useRef } from "react";
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
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!profile?.id) {
      console.log('No profile ID available for call subscription');
      return;
    }

    const setupSubscription = () => {
      try {
        console.log('Setting up call subscriptions for user:', profile.id);
        
        // Clean up existing subscription if any
        if (channelRef.current) {
          console.log('Cleaning up existing call subscription');
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }

        // Create a unique channel name using user ID
        const channelName = `calls_${profile.id}_${Date.now()}`;
        console.log('Creating channel:', channelName);

        // Create a new subscription channel
        channelRef.current = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'calls',
              filter: `receiver_id=eq.${profile.id}`,
            },
            async (payload) => {
              console.log('Received call event:', payload);

              try {
                // Handle new incoming calls
                if (payload.eventType === 'INSERT' && payload.new.receiver_id === profile.id) {
                  console.log('New incoming call detected:', payload.new);
                  
                  // Get caller details
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
                  console.log('Caller name:', callerName);

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
                          .update({ status: 'ended' })
                          .eq('id', payload.new.id);
                      }
                    }
                  );
                }

                // Handle call status updates
                if (payload.eventType === 'UPDATE') {
                  console.log('Call status updated:', payload.new.status);
                  
                  switch (payload.new.status) {
                    case 'connected':
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
                  }
                }
              } catch (error) {
                console.error('Error handling call event:', error);
                toast.error('Error processing call event');
              }
            }
          )
          .subscribe((status) => {
            console.log('Call subscription status:', status);
            
            if (status === 'SUBSCRIBED') {
              console.log('Call subscription active for channel:', channelName);
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Error subscribing to calls on channel:', channelName);
              toast.error('Could not subscribe to calls');
            }
          });
      } catch (error) {
        console.error('Error in setupSubscription:', error);
        toast.error('Error setting up call subscription');
      }
    };

    setupSubscription();

    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Only clean up when component unmounts
    return () => {
      if (channelRef.current) {
        console.log('Cleaning up call subscription on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [profile?.id, navigate, onCallAccepted, onCallEnded]);
};