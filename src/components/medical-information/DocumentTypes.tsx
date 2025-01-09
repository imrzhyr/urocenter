import { FileText, Image, FileVideo, FileAudio } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DocumentTypes = () => {
  const { t, language } = useLanguage();

  const documentTypes = [
    {
      title: language === 'ar' ? "التقارير الطبية" : "Medical Reports",
      description: language === 'ar' ? "التقارير الطبية ونتائج الفحوصات" : "Medical reports and test results",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: language === 'ar' ? "الصور الطبية" : "Medical Images",
      description: language === 'ar' ? "الأشعة السينية والرنين المغناطيسي وغيرها" : "X-rays, MRIs, and other medical images",
      icon: Image,
      color: "bg-green-100 text-green-600",
    },
    {
      title: language === 'ar' ? "تقارير الفيديو" : "Video Reports",
      description: language === 'ar' ? "مقاطع فيديو للإجراءات الطبية" : "Medical procedure videos",
      icon: FileVideo,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: language === 'ar' ? "السجلات الصوتية" : "Audio Records",
      description: language === 'ar' ? "الملاحظات الصوتية والاستشارات" : "Voice notes and consultations",
      icon: FileAudio,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {documentTypes.map((type) => (
        <div 
          key={type.title}
          className="p-4 rounded-lg border border-border bg-card transition-colors"
        >
          <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-lg ${type.color}`}>
              <type.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">{type.title}</h3>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};