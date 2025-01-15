import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useCall } from "../call/CallProvider";
import { BackButton } from "@/components/BackButton";

interface DoctorChatHeaderProps {
  patientId: string;
  patientName: string;
  patientPhone: string | null;
  onRefresh: () => void;
}

export const DoctorChatHeader = ({ 
  patientId,
  patientName,
  patientPhone,
  onRefresh
}: DoctorChatHeaderProps) => {
  const { initiateCall } = useCall();

  const handleCall = () => {
    initiateCall(patientId, patientName);
  };

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <BackButton customRoute="/admin" />
        <div>
          <h3 className="font-medium text-white text-sm">
            {patientName}
          </h3>
          {patientPhone && (
            <p className="text-xs text-white/80">{patientPhone}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/20 h-8 w-8"
        onClick={handleCall}
      >
        <Phone className="h-5 w-5" />
      </Button>
    </div>
  );
};