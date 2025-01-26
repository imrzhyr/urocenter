import { useRef, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseAgoraCallProps {
  currentCallId: string | null;
  profileId: string | null;
  onCallConnected?: () => void;
}

export const useAgoraCall = ({ currentCallId, profileId, onCallConnected }: UseAgoraCallProps) => {
  const { t } = useLanguage();
  const agoraClient = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrack = useRef<ILocalAudioTrack | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately as we just needed it for permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast.error(t('error_microphone_permission_denied'));
        } else if (error.name === 'NotFoundError') {
          toast.error(t('error_no_microphone_found'));
        } else {
          toast.error(t('error_microphone_access'));
        }
      }
      return false;
    }
  };

  const setupAgoraClient = async () => {
    try {
      // First check if we have microphone permission
      const hasMicrophonePermission = await requestMicrophonePermission();
      if (!hasMicrophonePermission) {
        throw new Error('Microphone permission denied');
      }

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
        if (err instanceof Error) {
          if (err.message.includes('NotAllowedError')) {
            toast.error(t('error_microphone_permission_denied'));
          } else if (err.message.includes('NotFoundError')) {
            toast.error(t('error_no_microphone_found'));
          } else {
            toast.error(t('error_microphone_access'));
          }
        }
        throw new Error('Failed to access microphone');
      }
      
      return true;
    } catch (error) {
      console.error('Error in setupAgoraClient:', error);
      if (error instanceof Error && error.message === 'Microphone permission denied') {
        toast.error(t('error_microphone_permission_denied'));
      } else {
        toast.error(t('error_initialize_call'));
      }
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
      // First unpublish the track if it exists
      if (localAudioTrack.current) {
        try {
          await agoraClient.current.unpublish(localAudioTrack.current);
        } catch (error) {
          // Ignore unpublish errors as the connection might already be closed
          console.log('Unpublish skipped:', error);
        }
        
        // Stop and close the local track
        localAudioTrack.current.stop();
        localAudioTrack.current.close();
        localAudioTrack.current = null;
      }

      // Then leave the channel
      try {
        await agoraClient.current.leave();
      } catch (error) {
        // Ignore leave errors as we might not be in a channel
        console.log('Leave skipped:', error);
      }

      // Reset the client
      agoraClient.current = null;
      console.log('Left channel and cleaned up successfully');
    } catch (error) {
      console.error('Error in leaveChannel cleanup:', error);
      // Continue with cleanup even if there are errors
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