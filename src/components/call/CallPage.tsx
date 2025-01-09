import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Volume2, ArrowLeft, Phone, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [duration, setDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState<Date>();
  const [callingUser, setCallingUser] = useState<{ full_name: string; id: string } | null>(null);
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [isIncoming, setIsIncoming] = useState(false);

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

      // Subscribe to call status changes
      const channel = supabase
        .channel('call_status')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'calls',
            filter: `receiver_id=eq.${userId}`
          },
          (payload) => {
            if (payload.new.status === 'accepted') {
              setCallStatus('connected');
              setCallStartTime(new Date());
            } else if (payload.new.status === 'rejected' || payload.new.status === 'ended') {
              handleEndCall();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
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

  const handleEndCall = async () => {
    if (!userId || !profile?.id || !callStartTime) return;

    try {
      // Update call record
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

      // Add call duration message
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
          <motion.div 
            animate={{ 
              scale: callStatus === 'ringing' ? [1, 1.1, 1] : 1 
            }}
            transition={{ 
              repeat: callStatus === 'ringing' ? Infinity : 0,
              duration: 1.5 
            }}
            className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-3xl font-bold text-primary">
              {callingUser?.full_name?.[0]?.toUpperCase() || '?'}
            </span>
          </motion.div>
          <h2 className="text-xl font-semibold mb-2">{callingUser?.full_name}</h2>
          <p className="text-gray-500">
            {callStatus === 'ringing' && 'Calling...'}
            {callStatus === 'connected' && 'In call'}
            {callStatus === 'ended' && 'Call ended'}
          </p>
        </div>

        {callStatus === 'ringing' && isIncoming ? (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100"
              onClick={handleAcceptCall}
            >
              <Phone className="h-6 w-6 mb-2 text-green-500" />
              <span className="text-sm">Accept</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100"
              onClick={handleRejectCall}
            >
              <X className="h-6 w-6 mb-2 text-red-500" />
              <span className="text-sm">Reject</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className={`flex flex-col items-center p-4 ${isMuted ? 'bg-red-50 hover:bg-red-100' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <MicOff className="h-6 w-6 mb-2 text-red-500" />
              ) : (
                <Mic className="h-6 w-6 mb-2 text-primary" />
              )}
              <span className="text-sm">{isMuted ? 'Unmute' : 'Mute'}</span>
            </Button>

            <Button
              variant="outline"
              className={`flex flex-col items-center p-4 ${isSpeaker ? 'bg-primary/10' : ''}`}
              onClick={() => setIsSpeaker(!isSpeaker)}
            >
              <Volume2 className={`h-6 w-6 mb-2 ${isSpeaker ? 'text-primary' : ''}`} />
              <span className="text-sm">Speaker</span>
            </Button>

            <Button
              variant="destructive"
              className="flex flex-col items-center p-4"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-6 w-6 mb-2" />
              <span className="text-sm">End</span>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};