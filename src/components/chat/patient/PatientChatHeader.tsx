import { useLanguage } from "@/contexts/LanguageContext";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { BackButton } from "@/components/BackButton";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();

  const handleCall = () => {
    toast.info("Calling feature is currently unavailable");
  };

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <BackButton customRoute="/dashboard" />
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/7d63243e-3ad7-41fd-96b6-6452cca98258.png" 
            alt="UroCenter Logo" 
            className="h-6 w-auto"
          />
          <div>
            <h3 className="font-medium text-white text-sm">
              {t('doctor_name')}
            </h3>
            <p className="text-xs text-white/80">{t('doctor_title')}</p>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCall}
        className="text-white hover:bg-primary-foreground/10"
      >
        <PhoneCall className="h-5 w-5" />
      </Button>
    </div>
  );
};