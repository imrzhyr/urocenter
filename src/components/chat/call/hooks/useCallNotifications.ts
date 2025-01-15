import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IncomingCall {
  id: string;
  callerId: string;
  callerName: string;
}

export const useCallNotifications = (profileId: string | null) => {
  const [incomingCall, setIncomingCall] = React.useState<IncomingCall | null>(null);

  useEffect(() => {
    if (!profileId) return;

    const channel = supabase
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
            // Handle call end signal
            setIncomingCall(null);
            toast.info('Call ended');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId]);

  return { incomingCall, setIncomingCall };
};