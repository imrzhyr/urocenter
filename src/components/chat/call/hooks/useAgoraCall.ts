import { useState, useCallback, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseAgoraCallProps {
  currentCallId: string | null;
  profileId?: string;
  onConnectionStateChange?: (state: string) => void;
}

export const useAgoraCall = ({ currentCallId, profileId, onConnectionStateChange }: UseAgoraCallProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);

  const setupAgoraClient = async () => {
    try {
      if (!currentCallId || !profileId) return false;

      // Get Agora token from Edge Function
      const { data: { token, appId }, error } = await supabase.functions.invoke('get-agora-credentials', {
        body: { channelName: currentCallId, uid: profileId }
      });

      if (error || !token || !appId) {
        console.error('Failed to get Agora credentials:', error);
        toast.error('Failed to initialize call');
        return false;
      }

      // Initialize Agora client
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      // Set up event handlers
      client.on('connection-state-change', (state) => {
        console.log('Connection state changed to', state);
        setIsConnected(state === 'CONNECTED');
        onConnectionStateChange?.(state);
      });

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      // Initialize client with App ID
      await client.join(appId, currentCallId, token, profileId);
      
      // Create and publish local audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localTrackRef.current = audioTrack;
      await client.publish(audioTrack);

      console.log('Agora client setup successful');
      return true;
    } catch (error) {
      console.error('Error setting up Agora client:', error);
      toast.error('Failed to initialize call');
      return false;
    }
  };

  const joinChannel = async (channelId: string) => {
    try {
      if (!clientRef.current || !localTrackRef.current) {
        console.error('Agora client not initialized');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error joining channel:', error);
      return false;
    }
  };

  const leaveChannel = async () => {
    try {
      if (localTrackRef.current) {
        localTrackRef.current.close();
        localTrackRef.current = null;
      }
      
      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }
      
      setIsConnected(false);
      console.log('Left channel successfully');
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  const toggleMute = useCallback(() => {
    if (!localTrackRef.current) return false;
    
    const isMuted = localTrackRef.current.enabled;
    localTrackRef.current.setEnabled(!isMuted);
    return !isMuted;
  }, []);

  const toggleSpeaker = async () => {
    // Implementation depends on platform capabilities
    // For web, we can use the audio output devices API
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
      
      if (audioOutputs.length > 1) {
        // Toggle between default and first alternative speaker
        const currentDevice = await (clientRef.current as any)?.getCurrentAudioDevice();
        const nextDevice = audioOutputs.find(d => d.deviceId !== currentDevice?.deviceId);
        
        if (nextDevice) {
          await (clientRef.current as any)?.setAudioOutput(nextDevice.deviceId);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error toggling speaker:', error);
      return false;
    }
  };

  return {
    setupAgoraClient,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleSpeaker,
    isConnected
  };
};