import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types/profile';
import { Check } from 'lucide-react-native';

interface MessageStatusProps {
  message: Message;
}

export const MessageStatus = ({ message }: MessageStatusProps) => {
  return (
    <View style={styles.container}>
      {message.status === 'seen' && (
        <Check size={12} color="#9ca3af" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});