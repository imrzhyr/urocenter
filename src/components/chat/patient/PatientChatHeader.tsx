import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PatientChatHeaderProps {
  onBack?: () => void;
}

export const PatientChatHeader = ({ onBack }: PatientChatHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-lg font-semibold">
              {t("virtual_consultation")}
            </h2>
            <p className="text-sm opacity-90">
              {t("connect_with_doctor")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};