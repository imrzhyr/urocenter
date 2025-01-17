import { adminTranslations } from './adminTranslations';
import { patientTranslations } from './patientTranslations';
import { commonTranslations } from './commonTranslations';

export const translations = {
  en: {
    ...commonTranslations.en,
    ...adminTranslations.en,
    ...patientTranslations.en,
  },
  ar: {
    ...commonTranslations.ar,
    ...adminTranslations.ar,
    ...patientTranslations.ar,
  }
};