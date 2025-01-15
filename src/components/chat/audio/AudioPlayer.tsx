import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause } from 'lucide-react-native';

interface AudioPlayerProps {
  url: string;
  duration?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, duration }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement native audio playback
    console.log('Audio playback toggled:', url);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlay} style={styles.button}>
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </TouchableOpacity>
      <Text style={styles.duration}>
        {duration ? `${Math.round(duration)}s` : '--:--'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  button: {
    padding: 8,
  },
  duration: {
    marginLeft: 8,
    color: '#4b5563',
  },
});