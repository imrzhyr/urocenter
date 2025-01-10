export const formatNumber = (number: number, locale: 'en' | 'ar'): string => {
  if (locale === 'ar') {
    // Convert to Arabic numerals
    return number.toLocaleString('ar-EG');
  }
  return number.toLocaleString('en-US');
};

export const formatMedicalNumber = (
  value: number,
  unit: string,
  locale: 'en' | 'ar'
): string => {
  const formattedNumber = formatNumber(value, locale);
  return `${formattedNumber} ${unit}`;
};

export const formatDate = (date: Date, locale: 'en' | 'ar'): string => {
  if (locale === 'ar') {
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};