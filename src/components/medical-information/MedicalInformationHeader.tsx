import { useLanguage } from "@/contexts/LanguageContext";

interface MedicalInformationHeaderProps {
  uploadCount: number;
}

export const MedicalInformationHeader = ({ uploadCount }: MedicalInformationHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2 bg-white">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("medical_information_title")}
      </h1>
      <p className="text-muted-foreground">
        {t("upload_medical_docs")}
        {uploadCount > 0 && ` (${uploadCount} ${t("files_uploaded")})`}
      </p>
    </div>
  );
};