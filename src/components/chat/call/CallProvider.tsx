import React, { createContext, useContext } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { CallNotification } from './CallNotification';
import { ActiveCallUI } from './ActiveCallUI';
import { CallingUI } from './CallingUI';
import { useWebRTC } from './hooks/useWebRTC';
import { useCallState } from './hooks/useCallState';
import { useCallNotifications } from './hooks/useCallNotifications';
import { useCallActions } from './hooks/useCallActions';
import { toast } from 'sonner';

interface CallContextType {
  isInCall: boolean;
  isCalling: boolean;
  currentCallId: string | null;
  callDuration: number;
  isCallEnded: boolean;
  localStream: React.MutableRefObject<MediaStream | null>;
  acceptCall: (callId: string) => Promise<void>;
  rejectCall: (callId: string) => Promise<void>;
  endCall: () => Promise<void>;
  initiateCall: (receiverId: string, recipientName: string) => Promise<void>;
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
    callTimeoutRef,
    startDurationTimer,
    stopDurationTimer,
    clearCallTimeout,
    updateCallStatus
  } = useCallState({ profileId: profile?.id });

  const {
    peerConnection,
    localStream,
    setupWebRTC,
    cleanup: cleanupWebRTC
  } = useWebRTC({ currentCallId, profileId: profile?.id });

  const { incomingCall, setIncomingCall } = useCallNotifications(profile?.id);

  const { acceptCall, rejectCall, initiateCall } = useCallActions({
    profileId: profile?.id,
    setupWebRTC,
    clearCallTimeout,
    setCurrentCallId,
    setIsInCall,
    setIncomingCall,
    setIsCallEnded,
    startDurationTimer,
    updateCallStatus,
    peerConnection
  });

  const endCall = async () => {
    if (!currentCallId || !profile?.id) return;

    try {
      await updateCallStatus(currentCallId, 'ended', true);
      setIsCallEnded(true);
      stopDurationTimer();

      setTimeout(() => {
        cleanupWebRTC();
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

  const handleInitiateCall = async (receiverId: string, name: string) => {
    setRecipientName(name);
    await initiateCall(receiverId, name);
  };

  return (
    <CallContext.Provider 
      value={{ 
        isInCall, 
        isCalling,
        currentCallId,
        callDuration,
        isCallEnded,
        localStream,
        acceptCall, 
        rejectCall, 
        endCall,
        initiateCall: handleInitiateCall
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