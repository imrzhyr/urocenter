import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '@/types/language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n, t } = useTranslation();

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.style.textAlign = lang === 'ar' ? 'right' : 'left';
    localStorage.setItem('preferredLanguage', lang);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language: i18n.language as Language, 
        setLanguage, 
        t 
      }}
    >
      <div 
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} 
        className={`${i18n.language === 'ar' ? 'font-arabic' : ''} transition-all duration-300`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);