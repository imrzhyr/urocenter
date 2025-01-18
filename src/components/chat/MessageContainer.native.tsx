import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MessageList } from './MessageList.native';
import { MessageInput } from './MessageInput.native';
import { Message } from '@/types/profile';

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => void;
  isLoading: boolean;
  header?: React.ReactNode;
  userId: string;
}

export const MessageContainer = ({
  messages,
  onSendMessage,
  isLoading,
  header,
  userId
}: MessageContainerProps) => {
  const handleSendMessage = async (
    content: string, 
    fileInfo?: { url: string; name: string; type: string; duration?: number }
  ) => {
    try {
      // Send the file info directly without any JSON transformation
      await onSendMessage(
        content,
        fileInfo ? {
          url: fileInfo.url,
          name: fileInfo.name,
          type: fileInfo.type,
          duration: fileInfo.duration
        } : undefined
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      {header}
      <MessageList messages={messages} />
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});