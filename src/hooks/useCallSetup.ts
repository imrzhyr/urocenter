import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { CallingUser, CallStatus } from "@/types/call";

export const useCallSetup = (userId: string | undefined, profile: Profile | null) => {
  const [callingUser, setCallingUser] = useState<CallingUser | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('ringing');
  const [isIncoming, setIsIncoming] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUserDetails = async () => {
      if (!userId || !profile?.id) {
        console.log('Missing userId or profile.id:', { userId, profileId: profile?.id });
        return;
      }

      // First check if we have an active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('No active session found:', sessionError);
        toast.error('Authentication required');
        return;
      }

      try {
        console.log('Fetching user details for:', userId);
        
        // Check for existing active calls first
        const { data: existingCalls, error: checkError } = await supabase
          .from('calls')
          .select('*')
          .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
          .eq('status', 'initiated')
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing calls:', checkError);
          toast.error('Could not check existing calls');
          return;
        }

        if (existingCalls) {
          console.log('Active call already exists:', existingCalls);
          toast.error('You already have an active call');
          return;
        }

        // Fetch user details
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

        if (isMounted) {
          setCallingUser(data);
          
          // Only create call record if we're initiating the call and there's no active call
          if (!isIncoming && !existingCalls) {
            console.log('Creating outgoing call record:', { caller: profile.id, receiver: userId });
            const { error: callError } = await supabase
              .from('calls')
              .insert({
                caller_id: profile.id,
                receiver_id: userId,
                status: 'initiated',
                is_active: true
              });

            if (callError) {
              console.error('Error creating call record:', callError);
              toast.error('Could not initiate call');
              return;
            }
            console.log('Call record created successfully');
          }
        }
      } catch (error) {
        console.error('Error in call setup:', error);
        toast.error('Call setup failed');
      }
    };

    fetchUserDetails();

    return () => {
      isMounted = false;
    };
  }, [userId, profile?.id, isIncoming]);

  return {
    callingUser,
    callStatus,
    setCallStatus,
    isIncoming
  };
};