import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorChatHeaderProps {
  patientName: string;
  patientPhone: string;
  onRefresh: () => void;
  patientId: string;
}

export const DoctorChatHeader = ({ 
  patientName, 
  patientPhone,
  onRefresh,
}: DoctorChatHeaderProps) => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const navigate = useNavigate();

  if (!profile?.id) return null;

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <BackButton onClick={() => navigate("/dashboard")} />
        <div>
          <h3 className="font-medium text-white">
            {patientName || t('unknown_patient')}
          </h3>
          <p className="text-sm text-white/80">{patientPhone}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-primary-foreground/10"
          onClick={onRefresh}
        >
          <PhoneCall className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};