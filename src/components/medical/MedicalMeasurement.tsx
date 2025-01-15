import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatMedicalNumber } from '@/utils/numberFormatting';
import { Language } from '@/types/language';

interface MedicalMeasurementProps {
  value: number;
  unit: string;
  label: string;
  style?: object;
}

export const MedicalMeasurement = ({
  value,
  unit,
  label,
  style = {}
}: MedicalMeasurementProps) => {
  const { t, language } = useLanguage();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{t(label)}</Text>
      <Text style={styles.value}>
        {formatMedicalNumber(value, t(unit), language as Language)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
  },
});