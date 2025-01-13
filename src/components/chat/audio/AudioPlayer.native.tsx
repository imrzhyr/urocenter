import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { Audio } from 'expo-av';

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
}

export const AudioPlayer = ({ audioUrl, duration }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound>();

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handlePlayPause = async () => {
    try {
      setIsLoading(true);

      if (isPlaying && soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        if (!soundRef.current) {
          const { sound } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            { shouldPlay: true },
            (status) => {
              if (status.didJustFinish) {
                setIsPlaying(false);
              }
            }
          );
          soundRef.current = sound;
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
          });
        } else {
          await soundRef.current.playAsync();
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={handlePlayPause}
        disabled={isLoading}
        style={styles.playButton}
      >
        {isPlaying ? (
          <Pause size={20} color="#7c3aed" />
        ) : (
          <Play size={20} color="#7c3aed" />
        )}
      </TouchableOpacity>
      <Text style={styles.duration}>
        {duration ? `${Math.round(duration)}s` : '--'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8
  },
  playButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6'
  },
  duration: {
    fontSize: 12,
    color: '#6b7280'
  }
});