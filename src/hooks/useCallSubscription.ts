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
          
          // Type assertion to ensure TypeScript knows we're working with a Call
          const call = payload.new as Call;
          if (!call.status) return;
          
          if (call.status === 'accepted') {
            onCallAccepted();
          } else if (call.status === 'rejected' || call.status === 'ended') {
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