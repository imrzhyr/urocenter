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
        <div>
          <h3 className="font-medium text-white text-sm">
            Dr. Ali Kamal
          </h3>
          <p className="text-xs text-white/80">Consultant Urologist</p>
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