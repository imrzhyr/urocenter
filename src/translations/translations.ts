import { authTranslations } from './auth';
import { dashboardTranslations } from './dashboard';
import { settingsTranslations } from './settings';
import { profileTranslations } from './profile';

export const translations = {
  en: {
    ...authTranslations.en,
    ...dashboardTranslations.en,
    ...settingsTranslations.en,
    ...profileTranslations.en,
  },
  ar: {
    ...authTranslations.ar,
    ...dashboardTranslations.ar,
    ...settingsTranslations.ar,
    ...profileTranslations.ar,
  }
};