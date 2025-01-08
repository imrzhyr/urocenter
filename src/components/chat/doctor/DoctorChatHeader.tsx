import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { PatientInfoContainer } from "../PatientInfoContainer";

interface DoctorChatHeaderProps {
  patientId: string;
  patientName: string;
  onRefresh: () => void;
}

export const DoctorChatHeader = ({
  patientId,
  patientName,
  onRefresh
}: DoctorChatHeaderProps) => {
  const navigate = useNavigate();
  const [showReports, setShowReports] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarFallback className="bg-primary-foreground text-primary">
              {patientName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium leading-none">{patientName}</h2>
            <p className="text-sm text-white/60">Patient</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowReports(true)}
          className="rounded-full hover:bg-white/20"
        >
          <FileText className="h-5 w-5" />
        </Button>
      </div>

      <Dialog open={showReports} onOpenChange={setShowReports}>
        <DialogContent>
          <PatientInfoContainer patientId={patientId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};