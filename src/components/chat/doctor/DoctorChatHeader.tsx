import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PatientInfoContainer } from "../PatientInfoContainer";
import { startTransition } from "react";

interface DoctorChatHeaderProps {
  patientName: string;
  patientId: string;
  patientPhone: string;
  onRefresh: () => Promise<void>;
}

export const DoctorChatHeader = ({
  patientName,
  patientId,
  patientPhone,
  onRefresh
}: DoctorChatHeaderProps) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    startTransition(() => {
      onRefresh();
    });
  };

  return (
    <div className="p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PatientInfoContainer
          patientName={patientName}
          patientId={patientId}
          patientPhone={patientPhone}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRefresh}
        className="rounded-full"
      >
        <RefreshCcw className="h-5 w-5" />
      </Button>
    </div>
  );
};