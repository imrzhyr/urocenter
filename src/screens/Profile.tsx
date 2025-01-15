import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { NavigationProps } from '@/types/navigation';
import { EditProfileForm } from '@/components/profile/EditProfileForm';

const Profile = ({ navigation }: NavigationProps) => {
  const { profile } = useProfile();
  const { t } = useLanguage();

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('edit_profile')}</Text>
      </View>
      <EditProfileForm />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#7c3aed',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Profile;