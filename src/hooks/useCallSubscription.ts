import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  useEffect(() => {
    console.log('Setting up call subscription for userId:', userId);

    const channel = supabase
      .channel(`calls_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${userId}`,
        },
        async (payload) => {
          console.log('Received call update:', payload);

          if (payload.eventType === 'INSERT') {
            console.log('New call received');
            toast.info('Incoming call...');
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
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to call updates');
        }
      });

    return () => {
      console.log('Cleaning up call subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, onCallAccepted, onCallEnded]);
};