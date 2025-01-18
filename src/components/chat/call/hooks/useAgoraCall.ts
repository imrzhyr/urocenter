import { useRef, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseAgoraCallProps {
  currentCallId: string | null;
  profileId: string | null;
  onCallConnected?: () => void;
}

export const useAgoraCall = ({ currentCallId, profileId, onCallConnected }: UseAgoraCallProps) => {
  const agoraClient = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrack = useRef<ILocalAudioTrack | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  const setupAgoraClient = async () => {
    try {
      // Fetch Agora credentials from Edge Function
      const { data, error } = await supabase.functions.invoke('get-agora-credentials');
      
      if (error) {
        console.error('Failed to get Agora credentials:', error);
        throw new Error('Failed to get Agora credentials');
      }

      if (!data?.appId) {
        console.error('No Agora App ID returned');
        throw new Error('Agora App ID not configured');
      }

      console.log('Successfully retrieved Agora credentials');

      // Initialize Agora client
      agoraClient.current = AgoraRTC.createClient({ 
        mode: 'rtc',
        codec: 'vp8'
      });

      // Set up event handlers
      agoraClient.current.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
        await agoraClient.current?.subscribe(user, mediaType);
        if (mediaType === 'audio') {
          user.audioTrack?.play();
          // Call the onCallConnected callback when audio is published
          onCallConnected?.();
        }
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
      console.error('Call setup incomplete');
      toast.error('Call setup incomplete');
      return false;
    }

    try {
      // Get token from Edge Function
      const { data, error } = await supabase.functions.invoke('generate-agora-token', {
        body: { channelName }
      });

      if (error || !data?.token) {
        console.error('Failed to generate token:', error);
        throw new Error('Failed to generate token');
      }

      const { token, appId } = data;

      if (!appId) {
        console.error('No Agora App ID provided');
        throw new Error('Agora App ID not configured');
      }

      // Join the channel with proper error handling
      await agoraClient.current.join(appId, channelName, token, null);
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

  const toggleSpeaker = async () => {
    try {
      // Check if running on iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        const audioElements = document.querySelectorAll('audio');
        
        // Get current state (assuming first audio element represents current state)
        const firstAudio = audioElements[0] as HTMLAudioElement;
        const isSpeakerActive = firstAudio?.sinkId === 'speaker';
        
        // Toggle between speaker and default (earpiece)
        const newSinkId = isSpeakerActive ? '' : 'speaker';
        
        try {
          // Only create audio context when switching to speaker
          if (newSinkId === 'speaker') {
            if (!audioContext.current) {
              audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
              await audioContext.current.resume();
            }
          }
          
          // Apply the new sink ID to all audio elements
          await Promise.all(
            Array.from(audioElements).map(audio => {
              const audioEl = audio as HTMLAudioElement;
              if ('setSinkId' in audioEl) {
                return (audioEl as any).setSinkId(newSinkId);
              }
              return Promise.resolve();
            })
          );
          
          // If switching back to earpiece, close the audio context
          if (newSinkId === '') {
            if (audioContext.current) {
              await audioContext.current.close();
              audioContext.current = null;
            }
          }
          
          return !isSpeakerActive; // Return true if speaker is now active
        } catch (err) {
          console.error('Error switching iOS audio output:', err);
          toast.error('Failed to switch audio output');
          return false;
        }
      } else {
        // Desktop/Android behavior remains the same
        const audioDevices = await AgoraRTC.getPlaybackDevices();
        const speakerDevice = audioDevices.find(device => 
          device.label.toLowerCase().includes('speaker')
        );
        const earpieceDevice = audioDevices.find(device => 
          device.label.toLowerCase().includes('default') || 
          device.label.toLowerCase().includes('earpiece')
        );

        const currentDevice = audioDevices[0];
        const isSpeakerActive = currentDevice?.label.toLowerCase().includes('speaker');
        const targetDevice = isSpeakerActive ? earpieceDevice : speakerDevice;

        if (targetDevice) {
          try {
            if ('setSinkId' in HTMLAudioElement.prototype) {
              const audioElements = document.querySelectorAll('audio');
              await Promise.all(
                Array.from(audioElements).map(audio => 
                  (audio as any).setSinkId(targetDevice.deviceId)
                )
              );
            }
            return !isSpeakerActive;
          } catch (err) {
            console.error('Error switching audio output:', err);
            toast.error('Failed to switch audio output');
            return false;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error toggling speaker:', error);
      toast.error('Failed to switch audio output');
      return false;
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup audio context if it exists
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
    };
  }, []);

  return {
    setupAgoraClient,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleSpeaker
  };
};