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
    "settings": "Settings",
    "appearance": "Appearance",
    "dark_mode": "Dark Mode",
    "language": "Language",
    "select_language": "Select Language",
    "notifications": "Notifications",
    "push_notifications": "Push Notifications",
    "email_notifications": "Email Notifications",
    "privacy": "Privacy",
    "online_status": "Online Status",
    "read_receipts": "Read Receipts",
    "expert_care": "Expert Care",
    "specialized_treatment": "Specialized urological treatments",
    "direct_communication": "Direct Communication",
    "connect_with_doctor": "Connect with Dr. Ali Kamal",
    "uro_center": "UroCenter",
    "next_available": "Next Available",
    "schedule_consultation": "Schedule a consultation",
    "view_all_slots": "View All Slots",
    "today": "Today",
    "tomorrow": "Tomorrow",
    "virtual_consultation": "Virtual Consultation",
    "health_tips": "Health Tips",
    "from_doctor": "From Dr. Ali Kamal",
    "stay_hydrated": "Stay hydrated: Drink at least 8 glasses of water daily",
    "regular_exercise": "Regular exercise can help prevent urological issues",
    "schedule_checkups": "Schedule regular check-ups for prostate health",
    "monitor_habits": "Monitor your urinary habits and report changes",
    "start_journey": "Start Your Journey",
    "sign_in": "Sign In",
    "already_account": "Already have an account?",
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
    "settings": "الإعدادات",
    "appearance": "المظهر",
    "dark_mode": "الوضع الداكن",
    "language": "اللغة",
    "select_language": "اختر اللغة",
    "notifications": "الإشعارات",
    "push_notifications": "إشعارات الدفع",
    "email_notifications": "إشعارات البريد الإلكتروني",
    "privacy": "الخصوصية",
    "online_status": "الحالة على الإنترنت",
    "read_receipts": "إيصالات القراءة",
    "expert_care": "رعاية متخصصة",
    "specialized_treatment": "علاجات المسالك البولية المتخصصة",
    "direct_communication": "تواصل مباشر",
    "connect_with_doctor": "تواصل مع د. علي كمال",
    "uro_center": "مركز المسالك البولية",
    "next_available": "المواعيد المتاحة",
    "schedule_consultation": "جدولة استشارة",
    "view_all_slots": "عرض جميع المواعيد",
    "today": "اليوم",
    "tomorrow": "غداً",
    "virtual_consultation": "استشارة افتراضية",
    "health_tips": "نصائح صحية",
    "from_doctor": "من د. علي كمال",
    "stay_hydrated": "حافظ على رطوبة جسمك: اشرب 8 أكواب من الماء يومياً",
    "regular_exercise": "التمارين المنتظمة تساعد في الوقاية من مشاكل المسالك البولية",
    "schedule_checkups": "جدولة فحوصات منتظمة لصحة البروستاتا",
    "monitor_habits": "راقب عاداتك البولية وأبلغ عن التغييرات",
    "start_journey": "ابدأ رحلتك",
    "sign_in": "تسجيل الدخول",
    "already_account": "هل لديك حساب بالفعل؟",
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
