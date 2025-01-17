import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { authTranslations } from '@/translations/authTranslations';
import { profileTranslations } from '@/translations/profileTranslations';
import { dashboardTranslations } from '@/translations/dashboardTranslations';
import { progressTranslations } from '@/translations/progressTranslations';
import { commonTranslations } from '@/translations/commonTranslations';
import { paymentTranslations } from '@/translations/paymentTranslations';
import { chatTranslations } from '@/translations/chatTranslations';
import { medicalTranslations } from '@/translations/medicalTranslations';

const resources = {
  en: {
    translation: {
      ...authTranslations.en,
      ...profileTranslations.en,
      ...dashboardTranslations.en,
      ...progressTranslations.en,
      ...commonTranslations.en,
      ...paymentTranslations.en,
      ...chatTranslations.en,
      ...medicalTranslations.en,
    },
  },
  ar: {
    translation: {
      ...authTranslations.ar,
      ...profileTranslations.ar,
      ...dashboardTranslations.ar,
      ...progressTranslations.ar,
      ...commonTranslations.ar,
      ...paymentTranslations.ar,
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