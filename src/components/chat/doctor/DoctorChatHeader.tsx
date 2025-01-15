import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useCall } from "../call/CallProvider";

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
    <div className="flex items-center justify-between p-4">
      <div>
        <h2 className="text-lg font-semibold text-white">{patientName}</h2>
        {patientPhone && (
          <p className="text-sm text-white/80">{patientPhone}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/20"
        onClick={handleCall}
      >
        <Phone className="h-5 w-5" />
      </Button>
    </div>
  );
};