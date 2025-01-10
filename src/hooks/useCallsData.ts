import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Call } from '@/types/call';
import { Profile } from '@/types/profile';

export const useCallsData = (profile: Profile | null) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [callerNames, setCallerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCalls = async () => {
      if (!profile?.id) return;

      const { data: callsData } = await supabase
        .from('calls')
        .select('*')
        .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
        .order('started_at', { ascending: true });

      if (callsData) {
        const formattedCalls: Call[] = callsData.map(call => ({
          ...call,
          status: call.status as any,
          created_at: call.started_at || call.ended_at || ''
        }));
        setCalls(formattedCalls);
        
        const userIds = new Set(callsData.flatMap(call => [call.caller_id, call.receiver_id]));
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', Array.from(userIds));

        if (profiles) {
          const names: Record<string, string> = {};
          profiles.forEach(p => {
            names[p.id] = p.full_name || 'Unknown User';
          });
          setCallerNames(names);
        }
      }
    };

    fetchCalls();

    // Subscribe to call updates
    const channel = supabase
      .channel('calls_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls'
        },
        () => {
          fetchCalls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  return { calls, callerNames };
};