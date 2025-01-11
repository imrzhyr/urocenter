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
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{patientName}</h2>
          {patientPhone && (
            <p className="text-sm text-gray-600">{patientPhone}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          className="text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCall}
          className="text-gray-600 hover:text-gray-900"
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};