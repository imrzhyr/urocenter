import { authTranslations } from './auth';
import { dashboardTranslations } from './dashboard';
import { medicalTranslations } from './medical';
import { profileTranslations } from './profile';

export const translations = {
  en: {
    ...authTranslations.en,
    ...dashboardTranslations.en,
    ...medicalTranslations.en,
    ...profileTranslations.en,
  },
  ar: {
    ...authTranslations.ar,
    ...dashboardTranslations.ar,
    ...medicalTranslations.ar,
    ...profileTranslations.ar,
  }
};