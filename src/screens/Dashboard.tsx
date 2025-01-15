import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, Settings, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  const navigation = useNavigation();
  const { profile } = useProfile();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard')}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <User size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity 
          style={styles.chatCard}
          onPress={() => navigation.navigate('Chat')}
        >
          <MessageSquare size={24} color="#7c3aed" />
          <View style={styles.chatCardContent}>
            <Text style={styles.chatCardTitle}>{t('chat_with_doctor')}</Text>
            <Text style={styles.chatCardSubtitle}>{t('chat_subtitle')}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#7c3aed',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 16,
  },
  chatCardContent: {
    marginLeft: 12,
  },
  chatCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  chatCardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});