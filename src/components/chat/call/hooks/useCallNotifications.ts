import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CallNotificationState {
  incomingCall: { id: string; callerName: string } | null;
  setIncomingCall: (call: { id: string; callerName: string } | null) => void;
}

export const useCallNotifications = (profileId: string | undefined): CallNotificationState => {
  const [incomingCall, setIncomingCall] = useState<{ id: string; callerName: string } | null>(null);

  useEffect(() => {
    if (!profileId) return;

    const channel = supabase
      .channel('calls')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
        },
        async (payload) => {
          try {
            if (payload.eventType === 'INSERT' && payload.new.receiver_id === profileId) {
              const { data: caller, error: callerError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', payload.new.caller_id)
                .maybeSingle();

              if (callerError) throw callerError;

              setIncomingCall({
                id: payload.new.id,
                callerName: caller?.full_name || 'Unknown'
              });
            }
          } catch (error) {
            console.error('Error handling call event:', error);
            toast.error('Error processing call update');
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