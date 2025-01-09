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

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [duration, setDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState<Date>();
  const [callingUser, setCallingUser] = useState<CallingUser | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('ringing');
  const [isIncoming, setIsIncoming] = useState(false);

  // Define handleEndCall before it's used
  const handleEndCall = async () => {
    if (!userId || !profile?.id || !callStartTime) return;

    try {
      const { error: callError } = await supabase
        .from('calls')
        .update({
          ended_at: new Date().toISOString(),
          duration,
          status: 'ended'
        })
        .eq('caller_id', profile.id)
        .eq('receiver_id', userId)
        .eq('status', 'active');

      if (callError) {
        console.error('Error updating call record:', callError);
      }

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          user_id: userId,
          content: `Call ended - Duration: ${formatDuration(duration)}`,
          is_from_doctor: profile.role === 'admin',
          call_duration: duration
        });

      if (messageError) {
        console.error('Error creating call message:', messageError);
      }

      navigate(-1);
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Error ending call');
    }
  };

  useCallSubscription({
    userId: userId || '',
    onCallAccepted: () => {
      setCallStatus('connected');
      setCallStartTime(new Date());
    },
    onCallEnded: handleEndCall
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      
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

    fetchUserDetails();
  }, [userId, profile?.id]);

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
  }, [callStartTime]);

  const handleAcceptCall = async () => {
    if (!userId || !profile?.id) return;

    try {
      const { error } = await supabase
        .from('calls')
        .update({
          status: 'accepted',
          started_at: new Date().toISOString()
        })
        .eq('caller_id', userId)
        .eq('receiver_id', profile.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error accepting call:', error);
        toast.error('Could not accept call');
        return;
      }

      setCallStatus('connected');
      setCallStartTime(new Date());
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Error accepting call');
    }
  };

  const handleRejectCall = async () => {
    if (!userId || !profile?.id) return;

    try {
      const { error } = await supabase
        .from('calls')
        .update({
          status: 'rejected',
          ended_at: new Date().toISOString()
        })
        .eq('caller_id', userId)
        .eq('receiver_id', profile.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error rejecting call:', error);
        toast.error('Could not reject call');
        return;
      }

      navigate(-1);
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Error rejecting call');
    }
  };

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
            {callStatus === 'ringing' && 'Calling...'}
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
            onEndCall={handleEndCall}
          />
        )}
      </motion.div>
    </div>
  );
};