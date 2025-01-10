import { useLanguage } from "@/contexts/LanguageContext";
import { CallButton } from "../CallButton";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between p-4 bg-primary">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-white text-lg">AK</span>
        </div>
        <div>
          <h3 className="font-medium text-white">{t('doctor_name')}</h3>
          <p className="text-sm text-white/80">{t('doctor_title')}</p>
        </div>
      </div>
      <CallButton />
    </div>
  );
};