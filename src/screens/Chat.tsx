import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UserChatContainer } from '@/components/chat/UserChatContainer.native';
import { NavigationProps } from '@/types/navigation';

const Chat = ({ navigation }: NavigationProps) => {
  return (
    <View style={styles.container}>
      <UserChatContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Chat;