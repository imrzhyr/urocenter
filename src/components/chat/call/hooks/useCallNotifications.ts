import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IncomingCall {
  id: string;
  callerName: string;
}

export const useCallNotifications = (profileId: string | undefined) => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);

  useEffect(() => {
    if (!profileId) return;

    // Listen for new calls where user is the receiver
    const callsChannel = supabase
      .channel('calls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${profileId}`,
        },
        async (payload) => {
          // Get caller's name
          const { data: caller } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', payload.new.caller_id)
            .single();

          if (caller) {
            setIncomingCall({
              id: payload.new.id,
              callerName: caller.full_name || 'Unknown caller'
            });
          }
        }
      )
      .subscribe();

    // Listen for call signals (e.g., call end)
    const signalsChannel = supabase
      .channel('call-signals')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_signals',
          filter: `to_user=eq.${profileId}`,
        },
        (payload) => {
          if (payload.new.type === 'end_call') {
            setIncomingCall(null);
            toast.info('Call ended');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(callsChannel);
      supabase.removeChannel(signalsChannel);
    };
  }, [profileId]);

  return { incomingCall, setIncomingCall };
};