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
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const maxRetries = 3;
  const retryCount = useRef(0);

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

        // Create a new subscription channel
        channelRef.current = supabase
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
              } catch (error) {
                console.error('Error handling call event:', error);
                toast.error('Error processing call event');
              }
            }
          )
          .subscribe((status) => {
            console.log('Call subscription status:', status);
            
            if (status === 'SUBSCRIBED') {
              console.log('Call subscription active');
              retryCount.current = 0; // Reset retry count on successful subscription
              if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = undefined;
              }
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              console.log('Call subscription closed or error:', status);
              
              // Attempt to reconnect if within retry limits
              if (retryCount.current < maxRetries) {
                retryCount.current++;
                console.log(`Attempting to reconnect (${retryCount.current}/${maxRetries})`);
                
                // Exponential backoff for retries
                const delay = Math.min(1000 * Math.pow(2, retryCount.current - 1), 10000);
                retryTimeoutRef.current = setTimeout(() => {
                  setupSubscription();
                }, delay);
              } else {
                console.log('Max retry attempts reached');
                toast.error('Unable to maintain call connection. Please try again later.');
              }
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

    return () => {
      console.log('Cleaning up call subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = undefined;
      }
    };
  }, [profile?.id, navigate, onCallAccepted, onCallEnded]);
};