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
      console.log('No profile ID available for call subscription');
      return;
    }

    console.log('Setting up call subscription for user:', profile.id);
    
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
          console.log('Received call payload:', payload);

          const newCall = payload.new as Call;
          if (!newCall || newCall.status !== 'initiated') {
            return;
          }

          // Check if we're already showing a dialog for this call
          if (callDialog.isOpen && callDialog.callId === newCall.id) {
            return;
          }

          try {
            // Get caller details
            const { data: callerData, error: callerError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', newCall.caller_id)
              .single();
            
            if (callerError) {
              console.error('Error fetching caller details:', callerError);
              return;
            }

            const callerName = callerData?.full_name || 'Unknown Caller';
            console.log('Incoming call from:', callerName);

            // Show browser notification if permitted
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

            // Open call dialog
            setCallDialog({
              isOpen: true,
              callerId: newCall.caller_id,
              callerName,
              callId: newCall.id
            });

            // Show toast notification
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
            console.error('Error handling incoming call:', error);
            toast.error('Error processing incoming call');
          }
        }
      )
      .subscribe((status) => {
        console.log('Call subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Call subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to calls');
          toast.error('Could not subscribe to calls');
        }
      });

    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Cleaning up call subscription');
      supabase.removeChannel(channel);
    };
  }, [profile?.id, navigate]);

  return {
    callDialog,
    setCallDialog
  };
};