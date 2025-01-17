import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardTranslations } from '@/translations/dashboardTranslations';
import { adminTranslations } from '@/translations/adminTranslations';
import { commonTranslations } from '@/translations/commonTranslations';
import { authTranslations } from '@/translations/authTranslations';
import { profileTranslations } from '@/translations/profileTranslations';
import { chatTranslations } from '@/translations/chatTranslations';
import { medicalTranslations } from '@/translations/medicalTranslations';
import { paymentTranslations } from '@/translations/paymentTranslations';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const isRTL = language === 'ar';

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const t = (key: string): string => {
    const translations = {
      ar: {
        ...commonTranslations.ar,
        ...authTranslations.ar,
        ...profileTranslations.ar,
        ...dashboardTranslations.ar,
        ...adminTranslations.ar,
        ...chatTranslations.ar,
        ...medicalTranslations.ar,
        ...paymentTranslations.ar,
      },
      en: {
        ...commonTranslations.en,
        ...authTranslations.en,
        ...profileTranslations.en,
        ...dashboardTranslations.en,
        ...adminTranslations.en,
        ...chatTranslations.en,
        ...medicalTranslations.en,
        ...paymentTranslations.en,
      }
    };

    // Get the translation for the current language
    const translation = translations[language]?.[key];
    
    // If translation doesn't exist in current language, try English
    if (!translation && language !== 'en') {
      return translations.en[key] || key;
    }
    
    // Return translation or key as fallback
    return translation || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};