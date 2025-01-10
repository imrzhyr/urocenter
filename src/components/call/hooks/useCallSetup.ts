import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { CallingUser, CallStatus } from "@/types/call";

export const useCallSetup = (userId: string | undefined, profile: Profile | null) => {
  const [callingUser, setCallingUser] = useState<CallingUser | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('ringing');
  const [isIncoming, setIsIncoming] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !profile?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, id')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user details:', error);
        toast.error('Could not fetch user details');
        return;
      }

      setCallingUser(data);
      
      // Check for existing active calls before creating a new one
      const { data: existingCalls, error: checkError } = await supabase
        .from('calls')
        .select('*')
        .eq('status', 'initiated')
        .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
        .order('started_at', { ascending: false })
        .limit(1);

      if (checkError) {
        console.error('Error checking existing calls:', checkError);
        return;
      }

      if (existingCalls && existingCalls.length > 0) {
        const activeCall = existingCalls[0];
        console.log('Found existing call:', activeCall);
        setActiveCallId(activeCall.id);
        
        if (activeCall.caller_id === profile.id) {
          console.log('We are the caller in the existing call');
          setIsIncoming(false);
        } else if (activeCall.receiver_id === profile.id) {
          console.log('We are the receiver in the existing call');
          setIsIncoming(true);
        }
        return;
      }

      // Only create new call if we're on the call page and there's no existing call
      if (window.location.pathname.includes('/call/')) {
        console.log('Creating new outgoing call:', { caller: profile.id, receiver: userId });
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
          console.error('Error creating call record:', callError);
          toast.error('Could not initiate call');
          return;
        }
        
        setIsIncoming(false);
        setActiveCallId(newCall.id);
        console.log('New outgoing call created successfully:', newCall);
      }
    };

    fetchUserDetails();
  }, [userId, profile?.id]);

  return {
    callingUser,
    callStatus,
    setCallStatus,
    isIncoming,
    activeCallId
  };
};