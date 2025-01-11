import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { CallingUser, CallStatus } from "@/types/call";

export const useCallSetup = (userId: string | undefined, profile: Profile | null) => {
  const [callingUser, setCallingUser] = useState<CallingUser | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('ringing');
  const [isIncoming, setIsIncoming] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const setupCompleted = useRef(false);

  useEffect(() => {
    if (!userId || !profile?.id || setupCompleted.current) {
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, id')
          .eq('id', userId)
          .single();

        if (error) {
          toast.error('Could not fetch user details');
          return;
        }

        setCallingUser(data);
        
        const { data: existingCalls, error: checkError } = await supabase
          .from('calls')
          .select('*')
          .eq('status', 'initiated')
          .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
          .order('started_at', { ascending: false })
          .limit(1);

        if (checkError) {
          return;
        }

        if (existingCalls && existingCalls.length > 0) {
          const activeCall = existingCalls[0];
          setActiveCallId(activeCall.id);
          const isReceiver = activeCall.receiver_id === profile.id;
          setIsIncoming(isReceiver);
          setupCompleted.current = true;
          return;
        }

        if (window.location.pathname.includes('/call/')) {
          const { data: newCall, error: callError } = await supabase
            .from('calls')
            .insert({
              caller_id: profile.id,
              receiver_id: userId,
              status: 'initiated'
            })
            .select()
            .single();

          if (callError) {
            toast.error('Could not initiate call');
            return;
          }
          
          setIsIncoming(false);
          setActiveCallId(newCall.id);
          setupCompleted.current = true;
        }
      } catch (error) {
        toast.error('Call setup failed');
      }
    };

    fetchUserDetails();

    return () => {
      setupCompleted.current = false;
    };
  }, [userId, profile?.id]);

  return {
    callingUser,
    callStatus,
    setCallStatus,
    isIncoming,
    setIsIncoming,
    activeCallId
  };
};