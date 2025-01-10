import { authTranslations } from './auth';
import { medicalTranslations } from './medical';
import { commonTranslations } from './common';
import { messageTranslations } from './messages';

export const translations = {
  en: {
    ...authTranslations.en,
    ...medicalTranslations.en,
    ...commonTranslations.en,
    ...messageTranslations.en
  },
  ar: {
    ...authTranslations.ar,
    ...medicalTranslations.ar,
    ...commonTranslations.ar,
    ...messageTranslations.ar
  }
};