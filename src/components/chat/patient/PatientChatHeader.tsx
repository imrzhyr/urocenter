import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { BackButton } from "@/components/BackButton";
import { CallButton } from "../call/CallButton";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <BackButton customRoute="/dashboard" />
        <div>
          <h3 className="font-medium text-white text-sm">
            {t('doctor_name')}
          </h3>
          <p className="text-xs text-white/80">{t('doctor_title')}</p>
        </div>
      </div>
      <CallButton 
        receiverId="doctor-id"
        className="text-white hover:bg-primary-foreground/10 h-8 w-8"
      />
    </div>
  );
};