import { useRef, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseAgoraCallProps {
  currentCallId: string | null;
  profileId: string | null;
}

export const useAgoraCall = ({ currentCallId, profileId }: UseAgoraCallProps) => {
  const agoraClient = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrack = useRef<ILocalAudioTrack | null>(null);

  const setupAgoraClient = async () => {
    try {
      // Fetch Agora credentials from Edge Function
      const { data: { appId }, error } = await supabase.functions.invoke('get-agora-credentials');
      
      if (error || !appId) {
        throw new Error('Failed to get Agora credentials');
      }

      // Initialize Agora client with disabled statistics
      agoraClient.current = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8',
        enableLogUpload: false, // Disable log upload
        enableCloudProxy: false, // Disable cloud proxy
        turnServer: {
          turnServerURL: "", // Empty string as we're not using TURN server
          username: "",      // Empty string as we're not using TURN server
          password: "",      // Empty string as we're not using TURN server
          forceturn: false   // Disable forced TURN server usage
        }
      });
      
      // Create and get microphone audio track
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
      
      return true;
    } catch (error) {
      console.error('Error in setupAgoraClient:', error);
      toast.error('Failed to initialize audio call');
      return false;
    }
  };

  const joinChannel = async (channelName: string) => {
    if (!agoraClient.current || !localAudioTrack.current) {
      toast.error('Call setup incomplete');
      return false;
    }

    try {
      // Get token from Edge Function
      const { data: { token }, error } = await supabase.functions.invoke('generate-agora-token', {
        body: { channelName }
      });

      if (error || !token) {
        throw new Error('Failed to generate token');
      }

      // Join the channel
      await agoraClient.current.join(token, channelName, null);
      await agoraClient.current.publish(localAudioTrack.current);
      
      return true;
    } catch (error) {
      console.error('Error joining channel:', error);
      toast.error('Failed to join call');
      return false;
    }
  };

  const leaveChannel = async () => {
    if (!agoraClient.current) return;

    try {
      if (localAudioTrack.current) {
        localAudioTrack.current.stop();
        localAudioTrack.current.close();
      }
      await agoraClient.current.leave();
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  const toggleMute = () => {
    if (localAudioTrack.current) {
      if (localAudioTrack.current.enabled) {
        localAudioTrack.current.setEnabled(false);
        return true;
      } else {
        localAudioTrack.current.setEnabled(true);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    return () => {
      leaveChannel();
    };
  }, []);

  return {
    setupAgoraClient,
    joinChannel,
    leaveChannel,
    toggleMute
  };
};