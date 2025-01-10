import { useState, useEffect } from 'react';
import { webRTCService } from '@/services/webrtc';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWebRTC = (callId: string, userId: string, remoteUserId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('Setting up WebRTC with:', { callId, userId, remoteUserId });
    
    const channel = supabase.channel(`webrtc_${callId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webrtc_signaling',
          filter: `call_id=eq.${callId}`
        },
        async (payload) => {
          const { type, data } = payload.new;
          
          try {
            switch (type) {
              case 'offer':
                if (payload.new.receiver_id === userId) {
                  console.log('Handling incoming call offer');
                  const stream = await webRTCService.handleIncomingCall(callId, userId, remoteUserId);
                  setLocalStream(stream);
                  await webRTCService.acceptCall(data);
                }
                break;
              case 'answer':
                if (payload.new.receiver_id === userId) {
                  console.log('Handling call answer');
                  await webRTCService.handleAnswer(data);
                  setIsConnected(true);
                }
                break;
              case 'ice-candidate':
                if (payload.new.receiver_id === userId) {
                  console.log('Handling ICE candidate');
                  await webRTCService.handleIceCandidate(data);
                }
                break;
            }

            // Update remote stream after processing signaling data
            const newRemoteStream = webRTCService.getRemoteStream();
            if (newRemoteStream) {
              setRemoteStream(newRemoteStream);
              setIsConnected(true);
            }
          } catch (error) {
            console.error('Error handling signaling message:', error);
            toast.error('Error establishing connection');
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up WebRTC connection');
      supabase.removeChannel(channel);
      webRTCService.endCall();
    };
  }, [callId, userId, remoteUserId]);

  const startCall = async () => {
    try {
      console.log('Starting WebRTC call:', { callId, userId, remoteUserId });
      const stream = await webRTCService.startCall(callId, userId, remoteUserId);
      setLocalStream(stream);
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Could not start call. Please check your microphone permissions.');
    }
  };

  const endCall = async () => {
    console.log('Ending WebRTC call');
    await webRTCService.endCall();
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
  };

  return {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    endCall
  };
};