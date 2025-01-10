import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { MessageContainer } from './MessageContainer.native';
import { PatientChatHeader } from './patient/PatientChatHeader.native';
import { useChat } from '@/hooks/useChat';

export const UserChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = useChat(profile?.id);

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string }) => {
    if (!profile?.id) {
      console.error('No profile ID found');
      return;
    }
    await sendMessage(content, fileInfo);
  };

  if (!profile?.id) {
    console.log('No profile ID found, not rendering chat');
    return null;
  }

  return (
    <View style={styles.container}>
      <MessageContainer
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        header={<PatientChatHeader />}
        userId={profile.id}
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