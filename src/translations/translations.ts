import { authTranslations } from './authTranslations';
import { paymentTranslations } from './paymentTranslations';
import { commonTranslations } from './commonTranslations';
import { medicalTranslations } from './medicalTranslations';

export const translations = {
  en: {
    ...authTranslations.en,
    ...paymentTranslations.en,
    ...commonTranslations.en,
    ...medicalTranslations.en,
  },
  ar: {
    ...authTranslations.ar,
    ...paymentTranslations.ar,
    ...commonTranslations.ar,
    ...medicalTranslations.ar,
  }
};