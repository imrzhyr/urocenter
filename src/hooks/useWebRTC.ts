import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export const useWebRTC = (callId: string, userId: string, remoteUserId: string) => {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const validateIds = () => {
    if (!callId || !userId || !remoteUserId) {
      console.error('Missing required IDs:', { callId, userId, remoteUserId });
      return false;
    }
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(callId) || !uuidPattern.test(userId) || !uuidPattern.test(remoteUserId)) {
      console.error('Invalid UUID format:', { callId, userId, remoteUserId });
      return false;
    }
    return true;
  };

  const initializeWebRTC = useCallback(async () => {
    if (!validateIds()) {
      toast.error('Invalid call configuration');
      return;
    }

    try {
      console.log('Initializing WebRTC connection...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      });

      stream.getTracks().forEach(track => {
        if (pc) {
          console.log('Adding local track to peer connection:', track);
          pc.addTrack(track, stream);
        }
      });

      pc.ontrack = (event) => {
        console.log('Received remote track:', event.streams[0]);
        setRemoteStream(event.streams[0]);
        setIsConnected(true);
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          try {
            const candidateJson = {
              candidate: event.candidate.candidate,
              sdpMid: event.candidate.sdpMid,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              usernameFragment: event.candidate.usernameFragment
            } as Json;

            await supabase.from('webrtc_signaling').insert({
              call_id: callId,
              sender_id: userId,
              receiver_id: remoteUserId,
              type: 'ice-candidate',
              data: candidateJson
            });
          } catch (error) {
            console.error('Error sending ICE candidate:', error);
          }
        }
      };

      setPeerConnection(pc);
      return pc;
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      toast.error('Could not access microphone');
      throw error;
    }
  }, [callId, userId, remoteUserId]);

  const startCall = async () => {
    if (!peerConnection || !validateIds()) {
      console.error('Peer connection not initialized');
      return;
    }

    try {
      console.log('Creating and sending offer...');
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const offerJson = {
        type: offer.type,
        sdp: offer.sdp
      } as Json;

      await supabase.from('webrtc_signaling').insert({
        call_id: callId,
        sender_id: userId,
        receiver_id: remoteUserId,
        type: 'offer',
        data: offerJson
      });
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
      throw error;
    }
  };

  const endCall = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    setIsConnected(false);
  };

  // Listen for signaling messages
  useEffect(() => {
    if (!validateIds()) return;

    const channel = supabase.channel(`webrtc_${callId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webrtc_signaling',
          filter: `receiver_id=eq.${userId}`
        },
        async (payload) => {
          if (!payload.new || !peerConnection) return;

          const { type, data } = payload.new;
          console.log('Received signaling message:', { type, data });

          try {
            switch (type) {
              case 'offer':
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data as RTCSessionDescriptionInit));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                
                const answerJson = {
                  type: answer.type,
                  sdp: answer.sdp
                } as Json;

                await supabase.from('webrtc_signaling').insert({
                  call_id: callId,
                  sender_id: userId,
                  receiver_id: remoteUserId,
                  type: 'answer',
                  data: answerJson
                });
                break;

              case 'answer':
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data as RTCSessionDescriptionInit));
                setIsConnected(true);
                break;

              case 'ice-candidate':
                const candidate = new RTCIceCandidate({
                  candidate: data.candidate,
                  sdpMid: data.sdpMid,
                  sdpMLineIndex: data.sdpMLineIndex,
                  usernameFragment: data.usernameFragment
                });
                await peerConnection.addIceCandidate(candidate);
                break;
            }
          } catch (error) {
            console.error('Error handling signaling message:', error);
            toast.error('Error establishing connection');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [peerConnection, callId, userId, remoteUserId]);

  return {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    endCall,
    initializeWebRTC
  };
};