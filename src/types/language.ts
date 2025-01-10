export type Language = 'en' | 'ar';

export type TranslationValue = string | {
  minChars: string;
  upperCase: string;
  lowerCase: string;
  number: string;
  special: string;
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => TranslationValue;
}