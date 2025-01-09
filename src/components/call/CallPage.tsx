import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CallAvatar } from "./CallAvatar";
import { CallControls } from "./CallControls";
import { IncomingCallControls } from "./IncomingCallControls";
import { formatDuration } from "@/utils/callUtils";
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
      if (!userId) return;

      // If user is patient, set calling user as Dr. Ali Kamal
      if (profile?.role === 'patient') {
        setCallingUser({
          full_name: 'Dr. Ali Kamal',
          id: userId
        });
        return;
      }
      
      // If admin, fetch patient details
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
      
      // Create call record
      const { error: callError } = await supabase
        .from('calls')
        .insert({
          caller_id: profile?.id,
          receiver_id: userId,
          status: 'active'
        });

      if (callError) {
        console.error('Error creating call record:', callError);
        toast.error('Could not initiate call');
        return;
      }
    };

    const checkIfIncoming = async () => {
      if (!profile?.id || !userId) return;

      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('receiver_id', profile.id)
        .eq('caller_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error('Error checking incoming call:', error);
        return;
      }

      if (data) {
        setIsIncoming(true);
        setCallStatus('ringing');
      }
    };

    fetchUserDetails();
    checkIfIncoming();
  }, [userId, profile?.id, profile?.role]);

  useCallSubscription({
    userId: userId || '',
    onCallAccepted: () => {
      setCallStatus('connected');
      setCallStartTime(new Date());
      toast.success('Call connected');
    },
    onCallEnded: () => {
      handleEndCall(callStartTime);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/20 to-primary/5 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          {callStatus === 'connected' && (
            <span className="text-lg font-semibold text-primary animate-pulse">
              {formatDuration(duration)}
            </span>
          )}
        </div>

        <div className="text-center mb-12">
          <CallAvatar 
            name={callingUser?.full_name || ''} 
            isRinging={callStatus === 'ringing'} 
          />
          <h2 className="text-xl font-semibold mb-2">{callingUser?.full_name}</h2>
          <p className="text-gray-500">
            {callStatus === 'ringing' && (isIncoming ? 'Incoming call...' : 'Calling...')}
            {callStatus === 'connected' && 'In call'}
            {callStatus === 'ended' && 'Call ended'}
          </p>
        </div>

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
            onEndCall={() => handleEndCall(callStartTime)}
          />
        )}
      </motion.div>
    </div>
  );
};