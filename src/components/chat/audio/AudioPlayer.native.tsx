import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause } from 'lucide-react-native';

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
}

export const AudioPlayer = ({ audioUrl, duration }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <Pause size={20} color="#7c3aed" /> : <Play size={20} color="#7c3aed" />}
      </TouchableOpacity>
      <Text style={styles.duration}>{duration ? `${Math.round(duration)}s` : '--'}</Text>
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
  duration: {
    fontSize: 12,
    color: '#6b7280'
  }
});