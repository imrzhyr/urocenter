import { authTranslations } from './auth';
import { dashboardTranslations } from './dashboard';
import { commonTranslations } from './common';
import { healthTranslations } from './health';
import { messageTranslations } from './messages';

export const translations = {
  en: {
    ...authTranslations.en,
    ...dashboardTranslations.en,
    ...commonTranslations.en,
    ...healthTranslations.en,
    ...messageTranslations.en,
  },
  ar: {
    ...authTranslations.ar,
    ...dashboardTranslations.ar,
    ...commonTranslations.ar,
    ...healthTranslations.ar,
    ...messageTranslations.ar,
  }
};