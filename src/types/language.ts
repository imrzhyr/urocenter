export type Language = 'en' | 'ar';

export type TranslationValue = string;

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}