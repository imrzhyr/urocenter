import { useLanguage } from "@/contexts/LanguageContext";
import { BackButton } from "@/components/BackButton";
import { useNavigate } from "react-router-dom";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div>
          <h3 className="font-medium text-white">
            {t('doctor_name')}
          </h3>
          <p className="text-sm text-white/80">{t('doctor_title')}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-primary-foreground/10"
      >
        <PhoneCall className="h-5 w-5" />
      </Button>
    </div>
  );
};