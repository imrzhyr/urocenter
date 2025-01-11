import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PatientChatHeaderProps {
  onBack?: () => void;
}

export const PatientChatHeader = ({ onBack }: PatientChatHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {t("virtual_consultation")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("connect_with_doctor")}
          </p>
        </div>
      </div>
    </div>
  );
};