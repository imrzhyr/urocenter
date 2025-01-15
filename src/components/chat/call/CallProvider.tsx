import React, { createContext, useContext } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { CallNotification } from './CallNotification';
import { ActiveCallUI } from './ActiveCallUI';
import { CallingUI } from './CallingUI';
import { useCallState } from './hooks/useCallState';
import { useCallNotifications } from './hooks/useCallNotifications';
import { useCallActions } from './hooks/useCallActions';
import { useAgoraCall } from './hooks/useAgoraCall';
import { toast } from 'sonner';

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
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const [recipientName, setRecipientName] = React.useState<string>('');

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
    toggleMute
  } = useAgoraCall({
    currentCallId,
    profileId: profile?.id
  });

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

      setTimeout(() => {
        clearCallTimeout();
        setCurrentCallId(null);
        setIsInCall(false);
        setIsCalling(false);
        setIsCallEnded(false);
      }, 2000);
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call');
    }
  };

  const initiateCall = async (receiverId: string, name: string) => {
    if (!profile?.id) {
      toast.error('You must be logged in to make calls');
      return;
    }

    try {
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
      setRecipientName(name);
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
        toggleMute
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
      {isCalling && <CallingUI recipientName={recipientName} />}
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