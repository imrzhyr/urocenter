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
      const { data, error } = await supabase.functions.invoke('get-agora-credentials');
      
      if (error || !data?.appId) {
        console.error('Failed to get Agora credentials:', error || 'No App ID returned');
        throw new Error('Failed to get Agora credentials');
      }

      // Initialize Agora client
      agoraClient.current = AgoraRTC.createClient({ 
        mode: 'rtc',
        codec: 'vp8'
      });

      // Set up event handlers
      agoraClient.current.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
        await agoraClient.current?.subscribe(user, mediaType);
        console.log('Subscribe success');
      });

      agoraClient.current.on('user-unpublished', (user: IAgoraRTCRemoteUser) => {
        console.log('Remote user unpublished');
      });

      agoraClient.current.on('connection-state-change', (curState, prevState) => {
        console.log('Connection state changed:', prevState, '->', curState);
      });

      // Create and get microphone audio track with proper error handling
      try {
        localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
        console.log('Microphone track created successfully');
      } catch (err) {
        console.error('Error creating microphone track:', err);
        toast.error('Failed to access microphone');
        throw new Error('Failed to access microphone');
      }
      
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

      // Join the channel with proper error handling
      await agoraClient.current.join(token, channelName, null);
      await agoraClient.current.publish(localAudioTrack.current);
      console.log('Successfully joined channel:', channelName);
      
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
      console.log('Left channel successfully');
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  const toggleMute = () => {
    if (localAudioTrack.current) {
      const newState = !localAudioTrack.current.enabled;
      localAudioTrack.current.setEnabled(newState);
      return !newState; // Return true if muted, false if unmuted
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