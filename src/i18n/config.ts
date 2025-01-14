import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from '@/translations/translations';
import { medicalTranslations } from '@/translations/medicalTranslations';
import { chatTranslations } from '@/translations/chatTranslations';

// Merge all translations
const resources = {
  en: {
    translation: {
      ...translations.en,
      ...medicalTranslations.en,
      ...chatTranslations.en,
    },
  },
  ar: {
    translation: {
      ...translations.ar,
      ...medicalTranslations.ar,
      ...chatTranslations.ar,
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('preferredLanguage') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;