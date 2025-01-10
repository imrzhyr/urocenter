import { authTranslations } from './auth';
import { profileTranslations } from './profile';
import { medicalTranslations } from './medical';
import { consultationTranslations } from './consultation';
import { commonTranslations } from './common';

export const translations = {
  en: {
    ...authTranslations.en,
    ...profileTranslations.en,
    ...medicalTranslations.en,
    ...consultationTranslations.en,
    ...commonTranslations.en,
  },
  ar: {
    ...authTranslations.ar,
    ...profileTranslations.ar,
    ...medicalTranslations.ar,
    ...consultationTranslations.ar,
    ...commonTranslations.ar,
  }
};