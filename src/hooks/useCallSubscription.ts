import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Call } from "@/types/call";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface UseCallSubscriptionProps {
  userId: string;
  onCallAccepted: () => void;
  onCallEnded: () => void;
}

export const useCallSubscription = ({ 
  userId, 
  onCallAccepted, 
  onCallEnded 
}: UseCallSubscriptionProps) => {
  useEffect(() => {
    const channel = supabase
      .channel('call_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${userId}`
        },
        (payload: RealtimePostgresChangesPayload<Call>) => {
          if (!payload.new) return;
          const newStatus = payload.new.status;
          
          if (newStatus === 'accepted') {
            onCallAccepted();
          } else if (newStatus === 'rejected' || newStatus === 'ended') {
            onCallEnded();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onCallAccepted, onCallEnded]);
};