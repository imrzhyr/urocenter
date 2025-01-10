import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UserChatContainer } from '@/components/chat/UserChatContainer.native';
import { DoctorChatContainer } from '@/components/chat/doctor/DoctorChatContainer.native';
import { useProfile } from '@/hooks/useProfile';
import { useRoute, useNavigation } from '@react-navigation/native';

export const Chat = () => {
  const { profile } = useProfile();
  const route = useRoute();
  const navigation = useNavigation();
  const userId = route.params?.userId;
  const isAdmin = profile?.role === 'admin';

  if (!profile) {
    navigation.navigate('SignIn');
    return null;
  }

  if (!userId && !isAdmin) {
    return <UserChatContainer />;
  }

  if (userId && isAdmin) {
    return <DoctorChatContainer />;
  }

  navigation.navigate(isAdmin ? 'Admin' : 'Dashboard');
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});