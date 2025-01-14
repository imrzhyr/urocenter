import { useLanguage } from "@/contexts/LanguageContext";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { callSignaling } from '@/features/call/CallSignaling';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { callState } from '@/features/call/CallState';
import { BackButton } from "@/components/BackButton";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();

  const handleCall = async () => {
    if (!profile?.id) {
      toast.error("Cannot start call - profile not found");
      return;
    }
    
    try {
      callState.setStatus('ringing', profile.id);
      await callSignaling.initialize(profile.id);
      toast.success("Starting call...");
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
      callState.setStatus('idle');
    }
  };

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