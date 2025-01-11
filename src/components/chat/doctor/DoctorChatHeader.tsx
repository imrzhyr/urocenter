import { ArrowLeft, Phone, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface DoctorChatHeaderProps {
  patientId: string;
  patientName: string;
  patientPhone?: string | null;
  onRefresh: () => void;
  onBack?: () => void;
}

export const DoctorChatHeader = ({
  patientId,
  patientName,
  patientPhone,
  onRefresh,
  onBack
}: DoctorChatHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCall = () => {
    navigate(`/call/${patientId}`);
  };

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
            <h2 className="text-lg font-semibold">{patientName}</h2>
            {patientPhone && (
              <p className="text-sm opacity-90">{patientPhone}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="text-white hover:bg-primary-foreground/10"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCall}
            className="text-white hover:bg-primary-foreground/10"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};