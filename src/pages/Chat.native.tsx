import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UserChatContainer } from '@/components/chat/UserChatContainer.native';
import { DoctorChatContainer } from '@/components/chat/doctor/DoctorChatContainer.native';
import { useProfile } from '@/hooks/useProfile';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App.native';
import { StackNavigationProp } from '@react-navigation/stack';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const Chat = () => {
  const { profile } = useProfile();
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
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

  navigation.navigate(isAdmin ? 'Dashboard' : 'Dashboard');
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});