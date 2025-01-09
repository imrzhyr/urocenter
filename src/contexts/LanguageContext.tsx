import React, { createContext, useContext, useState, useEffect } from 'react';

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
    "signing_in": "Signing in...",
    "edit_profile": "Edit Profile",
    "logout": "Logout",
    "welcome": "Welcome",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "medical_information": "Medical Information",
    "payment": "Payment",
    "chat": "Chat",
    "call": "Call",
    "admin": "Admin",
    "continue": "Continue",
    "full_name": "Full Name",
    "gender": "Gender",
    "age": "Age",
    "complaint": "Complaint",
    "male": "Male",
    "female": "Female",
    "update_profile": "Update Profile",
    "save": "Save",
    "cancel": "Cancel",
    "clinic_location": "Clinic Location",
    "clinic_info": "Sulaymaniyah - Ibrahim Pasha Street - Opposite Sherko Printing & Advertising - Aran Building - Second Floor - Dr. Ali Kamal",
    "phone_numbers": "Phone Numbers",
    "work_hours": "Working Hours",
    "work_hours_detail": "2:00 PM - 6:00 PM (Closed on Fridays)",
    "upload_photo": "Take Picture",
    "upload_file": "Upload Files",
    "medical_reports": "Medical Reports",
    "medical_images": "Medical Images",
    "video_reports": "Video Reports",
    "audio_records": "Audio Records",
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
    "signing_in": "جاري تسجيل الدخول...",
    "edit_profile": "تعديل الملف الشخصي",
    "logout": "تسجيل الخروج",
    "welcome": "مرحباً",
    "dashboard": "لوحة التحكم",
    "profile": "الملف الشخصي",
    "medical_information": "المعلومات الطبية",
    "payment": "الدفع",
    "chat": "المحادثة",
    "call": "مكالمة",
    "admin": "المشرف",
    "continue": "متابعة",
    "full_name": "الاسم الكامل",
    "gender": "الجنس",
    "age": "العمر",
    "complaint": "الشكوى",
    "male": "ذكر",
    "female": "أنثى",
    "update_profile": "تحديث الملف الشخصي",
    "save": "حفظ",
    "cancel": "إلغاء",
    "clinic_location": "موقع العيادة",
    "clinic_info": "السليمانية- شارع ابراهيم باشا- مقابل مطبعة واعلانات شيركو- عمارة أران- الطابق الثاني- دكتور علي كمال",
    "phone_numbers": "أرقام الهاتف",
    "work_hours": "ساعات العمل",
    "work_hours_detail": "٢:٠٠ مساءً - ٦:٠٠ مساءً (مغلق يوم الجمعة)",
    "upload_photo": "التقاط صورة",
    "upload_file": "رفع الملفات",
    "medical_reports": "التقارير الطبية",
    "medical_images": "الصور الطبية",
    "video_reports": "تقارير الفيديو",
    "audio_records": "السجلات الصوتية",
  }
};

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
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} 
           className={`${language === 'ar' ? 'font-arabic' : ''} transition-all duration-300`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
