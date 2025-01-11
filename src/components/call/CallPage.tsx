import { useNavigate, useParams } from "react-router-dom";
import { CallContainer } from "./CallContainer";
import { useProfile } from "@/hooks/useProfile";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [callId, setCallId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<string>("ringing");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const { localStream, remoteStream, startCall, answerCall, endCall } = useWebRTC(
    callId || '',
    profile?.id || '',
    userId || ''
  );

  useEffect(() => {
    if (!profile?.id || !userId) return;

    const setupCall = async () => {
      try {
        // Modified query to handle multiple results
        const { data: existingCalls, error: queryError } = await supabase
          .from('calls')
          .select('*')
          .eq('status', 'initiated')
          .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (queryError) {
          console.error('Error querying calls:', queryError);
          toast.error('Could not check existing calls');
          return;
        }

        if (existingCalls && existingCalls.length > 0) {
          const existingCall = existingCalls[0];
          setCallId(existingCall.id);
          const isReceiver = existingCall.receiver_id === profile.id;
          
          if (isReceiver) {
            await answerCall();
          } else {
            await startCall();
          }
        } else {
          const { data: newCall, error } = await supabase
            .from('calls')
            .insert({
              caller_id: profile.id,
              receiver_id: userId,
              status: 'initiated'
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating call record:', error);
            toast.error('Could not initiate call');
            return;
          }

          setCallId(newCall.id);
          await startCall();
        }
      } catch (error) {
        console.error('Error setting up call:', error);
        toast.error('Call setup failed');
      }
    };

    setupCall();

    // Start duration timer when call is connected
    let intervalId: NodeJS.Timeout;
    if (callStatus === 'connected') {
      intervalId = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      endCall();
    };
  }, [profile?.id, userId, callStatus]);

  const onBack = () => {
    if (!userId) {
      navigate('/dashboard');
      return;
    }
    navigate(`/chat/${userId}`);
  };

  const handleEndCall = async () => {
    if (!callId) return;

    try {
      await supabase
        .from('calls')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString(),
          duration
        })
        .eq('id', callId);

      endCall();
      onBack();
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Could not end call properly');
    }
  };

  const handleToggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const mockUser = {
    full_name: "User",
    id: userId || ""
  };

  return (
    <CallContainer
      onBack={onBack}
      duration={duration}
      callStatus={callStatus}
      callingUser={mockUser}
      isIncoming={false}
      isMuted={isMuted}
      isSpeaker={isSpeaker}
      onToggleMute={handleToggleMute}
      onToggleSpeaker={handleToggleSpeaker}
      onEndCall={handleEndCall}
      onAcceptCall={answerCall}
      onRejectCall={handleEndCall}
    />
  );
};