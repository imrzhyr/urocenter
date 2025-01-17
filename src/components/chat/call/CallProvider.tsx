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
import { Portal } from '@/components/ui/portal';
import { callSoundUtils } from '@/utils/callSoundUtils';
import { verifyProfile } from '@/utils/profileUtils';

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
  const notificationRef = useRef<Notification | null>(null);
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

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (incomingCall) {
      if ('Notification' in window && Notification.permission === 'granted') {
        notificationRef.current = new Notification('Incoming Call', {
          body: `${incomingCall.callerName} is calling you`,
          icon: '/favicon.ico',
          tag: 'call-notification',
          requireInteraction: true
        });

        notificationRef.current.onclick = () => {
          window.focus();
          notificationRef.current?.close();
        };
      }

      callSoundUtils.playCallSound();
    } else {
      notificationRef.current?.close();
      callSoundUtils.stopCallSound();
    }

    return () => {
      notificationRef.current?.close();
      callSoundUtils.stopCallSound();
    };
  }, [incomingCall]);

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
      callSoundUtils.stopCallSound(); // Stop any ongoing call sounds
      setIsInCall(false); // Hide the call UI
      setIsCalling(false); // Ensure calling UI is also hidden

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
      <Portal>
        {incomingCall && (
          <CallNotification
            callerName={incomingCall.callerName}
            onAccept={() => acceptCall(incomingCall.id)}
            onReject={() => rejectCall(incomingCall.id)}
            open={!!incomingCall}
          />
        )}
        {isCalling && <CallingUI recipientName={recipientNameRef.current} />}
        {isInCall && !isCallEnded && <ActiveCallUI />}
      </Portal>
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