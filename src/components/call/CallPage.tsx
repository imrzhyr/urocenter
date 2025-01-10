import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CallControls } from "./CallControls";
import { IncomingCallControls } from "./IncomingCallControls";
import { CallHeader } from "./CallHeader";
import { CallInfo } from "./CallInfo";
import type { CallStatus, CallingUser } from "@/types/call";
import { useCallSubscription } from "@/hooks/useCallSubscription";
import { useCallHandlers } from "@/hooks/useCallHandlers";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date>();
  const [callingUser, setCallingUser] = useState<CallingUser | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('ringing');
  const [isIncoming, setIsIncoming] = useState(false);
  
  const {
    duration,
    setDuration,
    handleEndCall,
    handleAcceptCall,
    handleRejectCall
  } = useCallHandlers(userId, profile);

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
      
      // Only create call record if we're initiating the call
      if (!isIncoming) {
        console.log('Creating outgoing call record:', { caller: profile.id, receiver: userId });
        const { error: callError } = await supabase
          .from('calls')
          .insert({
            caller_id: profile.id,
            receiver_id: userId,
            status: 'active'
          });

        if (callError) {
          console.error('Error creating call record:', callError);
          toast.error('Could not initiate call');
          return;
        }
      }
    };

    const checkIfIncoming = async () => {
      if (!profile?.id || !userId) return;

      console.log('Checking for incoming calls from:', userId, 'to:', profile.id);
      
      // Get the most recent active call where current user is the receiver and other user is the caller
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('receiver_id', profile.id)
        .eq('caller_id', userId)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking incoming call:', error);
        return;
      }

      console.log('Incoming call check result:', data);

      // Only set as incoming if we are the receiver of an active call
      if (data && data.receiver_id === profile.id) {
        console.log('Setting as incoming call because we are the receiver');
        setIsIncoming(true);
        setCallStatus('ringing');
      } else {
        console.log('Not an incoming call for us');
        setIsIncoming(false);
      }
    };

    fetchUserDetails();
    checkIfIncoming();
  }, [userId, profile?.id, isIncoming]);

  useCallSubscription({
    userId: userId || '',
    onCallAccepted: () => {
      setCallStatus('connected');
      setCallStartTime(new Date());
      toast.success('Call connected');
    },
    onCallEnded: () => {
      handleEndCall(callStartTime);
      navigate(-1);
      toast.info('Call ended');
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStartTime) {
      interval = setInterval(() => {
        const seconds = Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000);
        setDuration(seconds);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [callStartTime, setDuration]);

  const onEndCall = () => {
    handleEndCall(callStartTime);
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-primary/20 to-primary/5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <CallHeader 
            onBack={() => navigate(-1)}
            duration={duration}
            callStatus={callStatus}
          />
          
          <CallInfo 
            callingUser={callingUser}
            callStatus={callStatus}
            isIncoming={isIncoming}
          />

          {callStatus === 'ringing' && isIncoming ? (
            <IncomingCallControls
              onAccept={handleAcceptCall}
              onReject={handleRejectCall}
            />
          ) : (
            <CallControls
              isMuted={isMuted}
              isSpeaker={isSpeaker}
              onToggleMute={() => setIsMuted(!isMuted)}
              onToggleSpeaker={() => setIsSpeaker(!isSpeaker)}
              onEndCall={onEndCall}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};