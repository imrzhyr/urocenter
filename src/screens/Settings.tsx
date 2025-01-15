import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { NavigationProps } from '@/types/navigation';
import { Moon, Bell, Lock } from 'lucide-react-native';

const Settings = ({ navigation }: NavigationProps) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings')}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Moon size={20} color="#7c3aed" />
          <Text style={styles.sectionTitle}>{t('appearance')}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('dark_mode')}</Text>
          <Switch />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color="#7c3aed" />
          <Text style={styles.sectionTitle}>{t('notifications')}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('push_notifications')}</Text>
          <Switch />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Lock size={20} color="#7c3aed" />
          <Text style={styles.sectionTitle}>{t('privacy')}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('online_status')}</Text>
          <Switch />
        </View>
      </View>
    </View>
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 14,
    color: '#374151',
  },
});

export default Settings;