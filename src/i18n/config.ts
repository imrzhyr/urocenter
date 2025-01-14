import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from '@/translations/translations';
import { chatTranslations } from '@/translations/chatTranslations';
import { medicalTranslations } from '@/translations/medicalTranslations';

const resources = {
  en: {
    translation: {
      ...translations.en,
      ...chatTranslations.en,
      ...medicalTranslations.en,
    },
  },
  ar: {
    translation: {
      ...translations.ar,
      ...chatTranslations.ar,
      ...medicalTranslations.ar,
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