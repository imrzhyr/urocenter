import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PhoneInput } from '@/components/PhoneInput';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { BackButton } from '@/components/BackButton';
import { NavigationProps } from '@/types/navigation';

const SignIn = ({ navigation }: NavigationProps) => {
  const [phone, setPhone] = useState("");
  const { t, language } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={[styles.header, language === 'ar' && styles.headerRtl]}>
        <BackButton />
        <LanguageSelector />
      </View>
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            {/* Icon placeholder */}
          </View>
          <Text style={styles.title}>{t('welcome_back')}</Text>
          <Text style={styles.subtitle}>{t('sign_in_continue')}</Text>
        </View>
        
        <PhoneInput value={phone} onChange={setPhone} />
      </View>
      
      <Text style={styles.footer}>{t('all_rights_reserved')}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7c3aed',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
  },
});

export default SignIn;