import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { cn } from "@/lib/utils";

const Terms = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className={cn(
            "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
            isRTL && "flex-row-reverse"
          )}
        >
          {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {t("back")}
        </Button>
        <LanguageSelector />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-6">
        <h1 className="text-3xl font-bold mb-2">{sections.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{sections.lastUpdated}</p>

        <div className="space-y-8">
          {sections.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms; 