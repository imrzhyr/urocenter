import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from '@/translations/translations';
import { medicalTranslations } from '@/translations/medicalTranslations';

// Merge all translations
const resources = {
  en: {
    translation: {
      ...translations.en,
      ...medicalTranslations.en,
    },
  },
  ar: {
    translation: {
      ...translations.ar,
      ...medicalTranslations.ar,
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false, // prevents suspense during language switch
    },
  });

export default i18n;