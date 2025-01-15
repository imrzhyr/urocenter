import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { CallNotification } from './CallNotification';
import { ActiveCallUI } from './ActiveCallUI';
import { CallingUI } from './CallingUI';
import { useCallState } from './hooks/useCallState';
import { useCallNotifications } from './hooks/useCallNotifications';
import { useAgoraCall } from './hooks/useAgoraCall';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CallContextType {
  isInCall: boolean;
  isCalling: boolean;
  currentCallId: string | null;
  callDuration: number;
  isCallEnded: boolean;
  acceptCall: (callId: string) => Promise<void>;
  rejectCall: (callId: string) => Promise<void>;
  endCall: () => Promise<void>;
  initiateCall: (receiverId: string, recipientName: string) => Promise<void>;
  toggleMute: () => boolean;
  toggleSpeaker: () => Promise<boolean>;
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const recipientNameRef = useRef<string>('');

  const {
    isInCall,
    setIsInCall,
    isCalling,
    setIsCalling,
    isCallEnded,
    setIsCallEnded,
    currentCallId,
    setCurrentCallId,
    callDuration,
    startDurationTimer,
    stopDurationTimer,
    clearCallTimeout,
    updateCallStatus
  } = useCallState({ profileId: profile?.id });

  const { incomingCall, setIncomingCall } = useCallNotifications(profile?.id);

  const {
    setupAgoraClient,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleSpeaker
  } = useAgoraCall({
    currentCallId,
    profileId: profile?.id
  });

  const verifyProfile = async (profileId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .maybeSingle();
      
      return !!profile;
    } catch (error) {
      console.error('Error verifying profile:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!currentCallId || !profile?.id) return;

    const channel = supabase
      .channel(`call_status_${currentCallId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'calls',
        filter: `id=eq.${currentCallId}`,
      }, async (payload) => {
        const newStatus = payload.new.status;
        if (newStatus === 'active' && isCalling) {
          setIsCalling(false);
          setIsInCall(true);
          startDurationTimer();
          toast.success('Call connected');
        } else if (newStatus === 'ended') {
          setIsCallEnded(true);
          stopDurationTimer();
          setTimeout(() => {
            clearCallTimeout();
            setCurrentCallId(null);
            setIsInCall(false);
            setIsCalling(false);
            setIsCallEnded(false);
          }, 3000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentCallId, profile?.id, isCalling]);

  const acceptCall = async (callId: string) => {
    if (!profile?.id) return;

    try {
      const success = await setupAgoraClient();
      if (!success) {
        toast.error('Failed to initialize call');
        return;
      }

      clearCallTimeout();
      setCurrentCallId(callId);
      setIsInCall(true);
      setIncomingCall(null);
      setIsCallEnded(false);

      const joined = await joinChannel(callId);
      if (!joined) {
        throw new Error('Failed to join call');
      }

      await updateCallStatus(callId, 'active');
      startDurationTimer();
      toast.success('Call connected');
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  };

  const rejectCall = async (callId: string) => {
    try {
      await updateCallStatus(callId, 'rejected', true);
      setIncomingCall(null);
      toast.info('Call rejected');
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Failed to reject call');
    }
  };

  const endCall = async () => {
    if (!currentCallId || !profile?.id) return;

    try {
      await updateCallStatus(currentCallId, 'ended', true);
      await leaveChannel();
      setIsCallEnded(true);
      stopDurationTimer();

      const { data: callData } = await supabase
        .from('calls')
        .select('caller_id, receiver_id')
        .eq('id', currentCallId)
        .single();

      if (callData) {
        const otherParticipantId = callData.caller_id === profile.id 
          ? callData.receiver_id 
          : callData.caller_id;

        const profileExists = await verifyProfile(otherParticipantId);
        
        if (!profileExists) {
          console.error('Other participant profile not found');
          toast.error('Failed to send call end signal');
          return;
        }

        const { error } = await supabase
          .from('call_signals')
          .insert({
            call_id: currentCallId,
            from_user: profile.id,
            to_user: otherParticipantId,
            type: 'end_call',
            data: { duration: callDuration }
          });

        if (error) {
          console.error('Error sending end call signal:', error);
          toast.error('Failed to send call end signal');
        }
      }
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call');
    }
  };

  const initiateCall = async (receiverId: string, recipientName: string) => {
    if (!profile?.id) {
      toast.error('You must be logged in to make calls');
      return;
    }

    try {
      const receiverExists = await verifyProfile(receiverId);
      if (!receiverExists) {
        toast.error('Cannot initiate call: recipient not found');
        return;
      }

      const success = await setupAgoraClient();
      if (!success) return;

      const { data: call, error } = await supabase
        .from('calls')
        .insert({
          caller_id: profile.id,
          receiver_id: receiverId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentCallId(call.id);
      recipientNameRef.current = recipientName;
      setIsCalling(true);

      const joined = await joinChannel(call.id);
      if (!joined) {
        throw new Error('Failed to join call');
      }
    } catch (error) {
      console.error('Error in initiateCall:', error);
      toast.error('Failed to start call');
    }
  };

  return (
    <CallContext.Provider 
      value={{ 
        isInCall, 
        isCalling,
        currentCallId,
        callDuration,
        isCallEnded,
        acceptCall, 
        rejectCall, 
        endCall,
        initiateCall,
        toggleMute,
        toggleSpeaker
      }}
    >
      {children}
      {incomingCall && (
        <CallNotification
          callerName={incomingCall.callerName}
          onAccept={() => acceptCall(incomingCall.id)}
          onReject={() => rejectCall(incomingCall.id)}
          open={!!incomingCall}
        />
      )}
      {isCalling && <CallingUI recipientName={recipientNameRef.current} />}
      {isInCall && <ActiveCallUI />}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};