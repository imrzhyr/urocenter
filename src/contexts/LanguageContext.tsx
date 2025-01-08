import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "welcome_back": "Welcome Back",
    "sign_in_continue": "Sign in to continue to your account",
    "continue_with_google": "Continue with Google",
    "all_rights_reserved": "© 2024 All rights reserved",
    "languages": "Languages",
    "enter_phone": "Enter your phone number",
    "enter_password": "Enter your password",
    "sign_in": "Sign in",
    "dont_have_account": "Don't have an account?",
    "sign_up": "Sign up",
    "signing_in": "Signing in..."
  },
  ar: {
    "welcome_back": "مرحباً بعودتك",
    "sign_in_continue": "سجل دخولك للمتابعة إلى حسابك",
    "continue_with_google": "المتابعة مع جوجل",
    "all_rights_reserved": "© 2024 جميع الحقوق محفوظة",
    "languages": "اللغات",
    "enter_phone": "أدخل رقم هاتفك",
    "enter_password": "أدخل كلمة المرور",
    "sign_in": "تسجيل الدخول",
    "dont_have_account": "ليس لديك حساب؟",
    "sign_up": "إنشاء حساب",
    "signing_in": "جاري تسجيل الدخول..."
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} 
           className={language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);