export type Language = 'en' | 'ar';

export type TranslationValue = string | {
  [key: string]: string;
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | TranslationValue;
}