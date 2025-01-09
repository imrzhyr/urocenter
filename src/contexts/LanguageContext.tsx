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
    "full_name": "Full Name *",
    "full_name_placeholder": "Enter your full name (at least two names)",
    "gender": "Gender *",
    "male": "Male",
    "female": "Female",
    "age": "Age *",
    "age_placeholder": "Enter your age",
    "medical_complaint": "Medical Complaint *",
    "medical_info": "Medical Info",
    "upload_medical": "Upload your medical documents and reports",
    "medical_reports": "Medical Reports",
    "lab_results": "Lab results, prescriptions, and medical records",
    "medical_images": "Medical Images",
    "xray_description": "X-rays, MRIs, and other medical images",
    "video_reports": "Video Reports",
    "video_description": "Medical procedure videos or consultations",
    "audio_records": "Audio Records",
    "audio_description": "Voice notes or audio consultations",
    "take_picture": "Take Picture",
    "upload_files": "Upload Files",
    "payment_subtitle": "Choose your preferred payment method",
    "consultation_fee": "Consultation Fee",
    "fee_amount": "25,000 IQD",
    "complete_payment": "Complete Payment",
    "kidney_pain": "Kidney pain with frequent urination",
    "blood_urine": "Blood in urine with flank pain",
    "difficulty_urinating": "Difficulty urinating with prostate concerns",
    "kidney_stones": "Recurring kidney stones with severe pain",
    "lower_urinary": "Lower urinary tract symptoms",
    "swelling_legs": "Swelling in legs with decreased urination"
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
    "full_name": "الاسم الكامل *",
    "full_name_placeholder": "أدخل اسمك الكامل (اسمين على الأقل)",
    "gender": "الجنس *",
    "male": "ذكر",
    "female": "أنثى",
    "age": "العمر *",
    "age_placeholder": "أدخل عمرك",
    "medical_complaint": "الشكوى الطبية *",
    "medical_info": "المعلومات الطبية",
    "upload_medical": "قم بتحميل وثائقك وتقاريرك الطبية",
    "medical_reports": "التقارير الطبية",
    "lab_results": "نتائج المختبر والوصفات الطبية والسجلات الطبية",
    "medical_images": "الصور الطبية",
    "xray_description": "الأشعة السينية والرنين المغناطيسي وغيرها من الصور الطبية",
    "video_reports": "تقارير الفيديو",
    "video_description": "مقاطع فيديو للإجراءات الطبية أو الاستشارات",
    "audio_records": "التسجيلات الصوتية",
    "audio_description": "الملاحظات الصوتية أو الاستشارات الصوتية",
    "take_picture": "التقاط صورة",
    "upload_files": "تحميل الملفات",
    "payment_subtitle": "اختر طريقة الدفع المفضلة لديك",
    "consultation_fee": "رسوم الاستشارة",
    "fee_amount": "25,000 دينار عراقي",
    "complete_payment": "إتمام الدفع",
    "kidney_pain": "ألم في الكلى مع تكرار التبول",
    "blood_urine": "دم في البول مع ألم في الخاصرة",
    "difficulty_urinating": "صعوبة في التبول مع مشاكل في البروستاتا",
    "kidney_stones": "حصوات كلى متكررة مع ألم شديد",
    "lower_urinary": "أعراض في المسالك البولية السفلية",
    "swelling_legs": "تورم في الساقين مع انخفاض التبول"
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
