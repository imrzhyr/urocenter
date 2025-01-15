import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '@/types/language';
import '../i18n/config';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

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

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};