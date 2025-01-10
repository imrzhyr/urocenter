import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/translations/translations';
import type { Language, LanguageContextType, TranslationValue } from '@/types/language';

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.style.textAlign = language === 'ar' ? 'right' : 'left';
  }, [language]);

  const t = (key: string): string | TranslationValue => {
    // Special cases for untranslated content
    if (key === 'uroCenter') return 'UroCenter';
    
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div 
        dir={language === 'ar' ? 'rtl' : 'ltr'} 
        className={`${language === 'ar' ? 'font-arabic' : ''} transition-all duration-300`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);