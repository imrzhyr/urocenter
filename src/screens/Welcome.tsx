import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stethoscope, MessageCircle } from 'lucide-react-native';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { NavigationProps } from '@/types/navigation';

const Welcome = ({ navigation }: NavigationProps) => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Stethoscope size={20} color="#7c3aed" />,
      title: t("expert_care"),
      description: t("specialized_treatment"),
    },
    {
      icon: <MessageCircle size={20} color="#7c3aed" />,
      title: t("direct_communication"),
      description: t("connect_with_doctor"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("uro_center")}</Text>
        <LanguageSelector />
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png" }}
            style={styles.profileImage}
          />
          <Text style={styles.doctorName}>{t("doctor_name")}</Text>
          <Text style={styles.doctorTitle}>{t("doctor_title")}</Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.iconContainer}>
                {feature.icon}
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.primaryButtonText}>{t("start_journey")}</Text>
          </TouchableOpacity>
          
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>{t("already_have_account")} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInLink}>{t("sign_in")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <Text style={styles.footer}>{t("all_rights_reserved")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#7c3aed',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginTop: 12,
  },
  doctorTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionButtons: {
    width: '100%',
    maxWidth: 400,
  },
  primaryButton: {
    backgroundColor: '#7c3aed',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  signInText: {
    fontSize: 12,
    color: '#6b7280',
  },
  signInLink: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '600',
  },
  footer: {
    padding: 12,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
  },
});

export default Welcome;