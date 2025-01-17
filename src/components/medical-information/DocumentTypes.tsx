import { FileText, Image, FileVideo, FileAudio } from "lucide-react";
import { DocumentTypeCard } from "./DocumentTypeCard";
import { useLanguage } from "@/contexts/LanguageContext";

export const DocumentTypes = () => {
  const { t } = useLanguage();
  
  const documentTypes = [
    {
      title: t("medical_reports"),
      description: t("lab_results"),
      icon: FileText,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: t("medical_images"),
      description: t("xray_description"),
      icon: Image,
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: t("video_reports"),
      description: t("video_description"),
      icon: FileVideo,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      title: t("audio_records"),
      description: t("audio_description"),
      icon: FileAudio,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
      {documentTypes.map((type) => (
        <DocumentTypeCard key={type.title} {...type} />
      ))}
    </div>
  );
};