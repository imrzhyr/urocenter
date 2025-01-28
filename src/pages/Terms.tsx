import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Terms = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const sections = language === 'ar' ? {
    title: "الشروط والأحكام",
    lastUpdated: "آخر تحديث: 1 فبراير 2025",
    sections: [
      {
        title: "1. نظرة عامة على الخدمة",
        content: "نحن نقدم خدمة استشارات طبية عن بُعد متخصصة في طب المسالك البولية. هذه المنصة تربط المرضى بأخصائيي المسالك البولية المؤهلين للحصول على استشارات طبية عبر الإنترنت."
      },
      {
        title: "2. الأهلية والتسجيل",
        content: "يجب أن يكون المستخدمون فوق سن 18 عامًا للتسجيل. يجب تقديم معلومات دقيقة وحديثة عند التسجيل، بما في ذلك رقم الهاتف والمعلومات الطبية ذات الصلة."
      },
      {
        title: "3. الخدمات الطبية",
        content: "الاستشارات المقدمة هي للأغراض الاستشارية فقط ولا تحل محل الفحص الطبي المباشر. في حالات الطوارئ، يجب على المرضى الاتصال بخدمات الطوارئ المحلية."
      },
      {
        title: "4. الخصوصية والسرية",
        content: "نحن نلتزم بحماية خصوصية معلوماتك الطبية. جميع البيانات مشفرة ومخزنة بشكل آمن وفقًا لمعايير حماية البيانات الصحية."
      },
      {
        title: "5. المدفوعات والرسوم",
        content: "الرسوم محددة مسبقًا لكل استشارة. يمكن إجراء المدفوعات عبر طرق الدفع المعتمدة. لا يتم رد المدفوعات إلا في حالات محددة وفقًا لسياسة الاسترداد."
      },
      {
        title: "6. إخلاء المسؤولية",
        content: "بينما نسعى لتقديم أفضل رعاية ممكنة، لا نتحمل المسؤولية عن أي نتائج تنشأ عن استخدام الخدمة. يجب على المستخدمين طلب رعاية طبية عاجلة عند الضرورة."
      }
    ]
  } : {
    title: "Terms and Conditions",
    lastUpdated: "Last Updated: February 1, 2025",
    sections: [
      {
        title: "1. Service Overview",
        content: "We provide specialized urological telemedicine consultation services. This platform connects patients with qualified urologists for online medical consultations."
      },
      {
        title: "2. Eligibility and Registration",
        content: "Users must be over 18 years old to register. Accurate and up-to-date information must be provided during registration, including phone number and relevant medical information."
      },
      {
        title: "3. Medical Services",
        content: "Consultations provided are for advisory purposes only and do not replace in-person medical examination. In emergency situations, patients should contact local emergency services."
      },
      {
        title: "4. Privacy and Confidentiality",
        content: "We are committed to protecting your medical information privacy. All data is encrypted and securely stored in accordance with health data protection standards."
      },
      {
        title: "5. Payments and Fees",
        content: "Fees are predetermined for each consultation. Payments can be made through approved payment methods. Refunds are only provided in specific cases according to the refund policy."
      },
      {
        title: "6. Disclaimer",
        content: "While we strive to provide the best possible care, we are not liable for any outcomes arising from the use of the service. Users should seek urgent medical care when necessary."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="container max-w-4xl mx-auto p-4 flex items-center">
        <motion.div 
          className="w-[72px]"
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 p-2 rounded-xl bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
          >
            {isRTL ? <ChevronRight className="h-5 w-5 text-[#0A84FF]" /> : <ChevronLeft className="h-5 w-5 text-[#0A84FF]" />}
          </Button>
        </motion.div>
        <motion.div 
          className="flex-1 flex justify-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
        >
          <button
            onClick={() => window.open('https://wa.me/+9647702428154', '_blank')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
          >
            <div className="w-5 h-5 text-[#0A84FF]">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4Z" fill="currentColor" fillOpacity="0.2"/>
                <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-[15px] font-medium bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">
              Help Center
            </span>
          </button>
        </motion.div>
        <motion.div 
          className="w-[72px] flex justify-end"
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <button
            onClick={() => setShowLanguageMenu(true)}
            className="flex items-center gap-2 p-2 rounded-xl bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
          >
            <Globe className="w-5 h-5 text-[#0A84FF]" />
          </button>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">{sections.title}</h1>
        <p className="text-sm text-gray-400 mb-8">{sections.lastUpdated}</p>

        <div className="space-y-8">
          {sections.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showLanguageMenu && (
          <LanguageSelector onClose={() => setShowLanguageMenu(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Terms; 