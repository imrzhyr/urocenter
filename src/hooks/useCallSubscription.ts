import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "./useProfile";
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
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!profile?.id || channelRef.current) {
      return;
    }

    const channelName = `calls_${profile.id}`;
    console.log('Setting up call subscription for user:', profile.id);
    
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${profile.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Call>) => {
          console.log('Received call payload:', payload);
          
          if (!payload.new) {
            return;
          }

          const newCall = payload.new as Call;

          // Handle different events
          if (payload.eventType === 'INSERT') {
            console.log('New incoming call detected:', newCall);
            // The incoming call dialog will be handled by useIncomingCalls
          } else if (payload.eventType === 'UPDATE') {
            if (newCall.status === 'connected') {
              console.log('Call was accepted:', newCall);
              onCallAccepted();
            } else if (newCall.status === 'ended') {
              console.log('Call was ended:', newCall);
              onCallEnded();
            }
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
      console.log('Cleaning up call subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [profile?.id, onCallAccepted, onCallEnded]);
};