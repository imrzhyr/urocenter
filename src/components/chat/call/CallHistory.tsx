import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface Call {
  id: string;
  caller_id: string;
  receiver_id: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

export const CallHistory = ({ userId }: { userId: string }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const { profile } = useProfile();

  useEffect(() => {
    const fetchCalls = async () => {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .or(`caller_id.eq.${profile?.id},receiver_id.eq.${profile?.id}`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setCalls(data);
      }
    };

    fetchCalls();

    // Subscribe to new calls
    const channel = supabase
      .channel('calls_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'calls' 
      }, () => {
        fetchCalls();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [profile?.id]);

  const getCallIcon = (call: Call) => {
    const isCaller = call.caller_id === profile?.id;
    
    if (call.status === 'missed') {
      return <PhoneMissed className="h-4 w-4 text-red-500" />;
    }
    
    if (isCaller) {
      return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
    }
    
    return <PhoneIncoming className="h-4 w-4 text-green-500" />;
  };

  const getCallDuration = (call: Call) => {
    if (!call.started_at || !call.ended_at) return null;
    const duration = new Date(call.ended_at).getTime() - new Date(call.started_at).getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (calls.length === 0) return null;

  return (
    <div className="px-4 py-2 space-y-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
      {calls.map((call) => (
        <div key={call.id} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getCallIcon(call)}
            <span className="text-gray-600 dark:text-gray-300">
              {format(new Date(call.created_at), 'MMM d, HH:mm')}
            </span>
          </div>
          {getCallDuration(call) && (
            <span className="text-gray-500 dark:text-gray-400">
              {getCallDuration(call)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};