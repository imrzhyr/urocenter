import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "./useProfile";
import { useNavigate } from "react-router-dom";
import { Call } from "@/types/call";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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
    if (!profile?.id || channelRef.current) {
      return;
    }

    console.log('Setting up call subscription for user:', profile.id);
    
    const channelName = `calls_${profile.id}`;
    
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
        async (payload: RealtimePostgresChangesPayload<Call>) => {
          console.log('Received call event:', payload);

          if (payload.eventType === 'INSERT' && payload.new.receiver_id === profile.id) {
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

          if (payload.eventType === 'UPDATE' && payload.new.status === 'connected') {
            onCallAccepted();
          }

          if (payload.eventType === 'UPDATE' && payload.new.status === 'ended') {
            onCallEnded();
          }
        }
      )
      .subscribe((status) => {
        console.log('Call subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Call subscription active for channel:', channelName);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to calls');
          toast.error('Could not subscribe to calls');
        }
      });

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up call subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [profile?.id, navigate, onCallAccepted, onCallEnded]);
};