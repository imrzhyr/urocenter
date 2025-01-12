import { useLanguage } from "@/contexts/LanguageContext";
import { BackButton } from "@/components/BackButton";
import { useNavigate } from "react-router-dom";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <BackButton onClick={() => navigate("/dashboard")} />
        <div>
          <h3 className="font-medium text-white">
            {t('doctor_name')}
          </h3>
          <p className="text-sm text-white/80">{t('doctor_title')}</p>
        </div>
      </div>
    </div>
  );
};