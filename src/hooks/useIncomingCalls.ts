import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./useProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Call } from "@/types/call";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface CallDialogState {
  isOpen: boolean;
  callerId: string;
  callerName: string;
  callId: string;
}

export const useIncomingCalls = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [callDialog, setCallDialog] = useState<CallDialogState>({
    isOpen: false,
    callerId: "",
    callerName: "",
    callId: ""
  });

  useEffect(() => {
    if (!profile?.id) {
      return;
    }
    
    const channel = supabase
      .channel(`calls_${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${profile.id}`
        },
        async (payload: RealtimePostgresChangesPayload<Call>) => {
          const newCall = payload.new as Call;
          if (!newCall || newCall.status !== 'initiated') {
            return;
          }

          const callTime = new Date(newCall.created_at).getTime();
          const now = new Date().getTime();
          const timeDiff = now - callTime;

          if (timeDiff > 2000) {
            return;
          }

          setTimeout(async () => {
            try {
              const { data: callerData, error: callerError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', newCall.caller_id)
                .single();
              
              if (callerError) {
                return;
              }

              const callerName = callerData?.full_name || 'Unknown Caller';

              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Incoming Call', {
                  body: `${callerName} is calling you`,
                  icon: '/favicon.ico',
                  requireInteraction: true
                }).onclick = () => {
                  window.focus();
                  setCallDialog({
                    isOpen: true,
                    callerId: newCall.caller_id,
                    callerName,
                    callId: newCall.id
                  });
                };
              }

              setCallDialog({
                isOpen: true,
                callerId: newCall.caller_id,
                callerName,
                callId: newCall.id
              });

              toast.info(`${callerName} is calling...`, {
                duration: Infinity,
                onDismiss: async () => {
                  await supabase
                    .from('calls')
                    .update({ status: 'ended' })
                    .eq('id', newCall.id);
                  setCallDialog(prev => ({ ...prev, isOpen: false }));
                }
              });
            } catch (error) {
              toast.error('Error processing incoming call');
            }
          }, 2000);
        }
      )
      .subscribe();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, navigate]);

  return {
    callDialog,
    setCallDialog
  };
};