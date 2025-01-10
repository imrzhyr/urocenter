import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MessageContainer } from '../MessageContainer.native';
import { useChat } from '@/hooks/useChat';
import { useProfile } from '@/hooks/useProfile';

export const DoctorChatContainer = () => {
  const { profile } = useProfile();
  const { messages, sendMessage, isLoading } = useChat(profile?.id);

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string }) => {
    if (!profile?.id) return;
    await sendMessage(content, fileInfo);
  };

  return (
    <View style={styles.container}>
      <MessageContainer
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        header={<View />}
        userId={profile?.id || ''}
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