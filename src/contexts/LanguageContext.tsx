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
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'en';
  });
  const isRTL = language === 'ar';

  // Force a re-render of the entire app when language changes
  useEffect(() => {
    // Set HTML dir attribute
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add/remove RTL class from body for global RTL styles
    if (isRTL) {
      document.body.classList.add('rtl-layout');
      document.documentElement.classList.add('font-noto-sans-arabic');
    } else {
      document.body.classList.remove('rtl-layout');
      document.documentElement.classList.remove('font-noto-sans-arabic');
    }

    // Force layout recalculation
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
  }, [language, isRTL]);

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
    // Clear any existing RTL-related classes first
    document.body.classList.remove('rtl-layout');
    document.documentElement.classList.remove('font-noto-sans-arabic');
    
    // Update language
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
      <div className={`app-root ${isRTL ? 'rtl-layout' : ''}`}>
        {children}
      </div>
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