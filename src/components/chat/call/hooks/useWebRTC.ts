import { useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseWebRTCProps {
  currentCallId: string | null;
  profileId: string | null;
}

/**
 * Hook to manage WebRTC connection and audio streaming
 */
export const useWebRTC = ({ currentCallId, profileId }: UseWebRTCProps) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Initialize WebRTC connection with audio stream
   */
  const setupWebRTC = async () => {
    try {
      console.log('Setting up WebRTC...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      // Verify audio track
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        throw new Error('No audio track available');
      }
      console.log('Audio track settings:', audioTrack.getSettings());
      
      localStream.current = stream;

      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      };

      peerConnection.current = new RTCPeerConnection(configuration);
      
      // Add local stream tracks
      stream.getTracks().forEach(track => {
        if (peerConnection.current && localStream.current) {
          peerConnection.current.addTrack(track, localStream.current);
        }
      });

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        console.log('Track capabilities:', event.track.getCapabilities());
        console.log('Track settings:', event.track.getSettings());
        
        if (!remoteAudioRef.current) {
          remoteAudioRef.current = new Audio();
          remoteAudioRef.current.autoplay = true;
        }
        
        if (!remoteStream.current) {
          remoteStream.current = new MediaStream();
        }
        
        remoteStream.current.addTrack(event.track);
        
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream.current;
          remoteAudioRef.current.play().catch(error => {
            console.error('Error playing remote audio:', error);
          });
        }
      };

      setupConnectionHandlers();
      return true;
    } catch (error) {
      console.error('Error in setupWebRTC:', error);
      toast.error('Failed to access microphone or setup call');
      return false;
    }
  };

  /**
   * Set up WebRTC connection state handlers
   */
  const setupConnectionHandlers = () => {
    if (!peerConnection.current) return;

    peerConnection.current.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.current?.connectionState);
      console.log('ICE gathering state:', peerConnection.current?.iceGatheringState);
      console.log('Signaling state:', peerConnection.current?.signalingState);
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerConnection.current?.iceConnectionState);
      if (peerConnection.current?.iceConnectionState === 'disconnected') {
        cleanup();
      }
    };

    peerConnection.current.onicecandidate = async (event) => {
      if (event.candidate && currentCallId && profileId) {
        console.log('Sending ICE candidate:', event.candidate);
        await supabase.from('call_signals').insert({
          call_id: currentCallId,
          from_user: profileId,
          to_user: profileId,
          type: 'ice-candidate',
          data: { candidate: event.candidate }
        });
      }
    };
  };

  /**
   * Clean up WebRTC resources
   */
  const cleanup = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current = null;
    }
    
    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach(track => track.stop());
      remoteStream.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return {
    peerConnection,
    localStream,
    remoteStream,
    setupWebRTC,
    cleanup
  };
};