import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { MessageList } from './MessageList.native';
import { MessageInput } from './MessageInput.native';
import { Message } from '@/types/profile';

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (message: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => void;
  isLoading: boolean;
  header: React.ReactNode;
  userId: string;
}

export const MessageContainer = ({
  messages,
  onSendMessage,
  isLoading,
  header,
  userId
}: MessageContainerProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {header}
      </View>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      >
        <MessageList messages={messages} />
      </ScrollView>
      <View style={styles.inputContainer}>
        <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: Platform.OS === 'web' ? '100vh' : '100%',
  },
  header: {
    backgroundColor: '#7c3aed',
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'web' ? 80 : 16,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#fff',
  }
});