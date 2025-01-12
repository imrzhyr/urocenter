import { User, ArrowLeft, FileText, Info } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ViewReportsDialog } from "@/components/medical-reports/ViewReportsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PatientInfoCard } from "../PatientInfoCard";

interface DoctorChatHeaderProps {
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  onRefresh: () => Promise<void>;
}

export const DoctorChatHeader = ({ patientId, patientName, patientPhone, onRefresh }: DoctorChatHeaderProps) => {
  const navigate = useNavigate();
  const [showReports, setShowReports] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  const firstLetter = patientName ? patientName.charAt(0).toUpperCase() : '?';

  const handleBack = () => {
    navigate("/admin");
  };

  return (
    <div className="flex items-center gap-4 p-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleBack}
        className="rounded-full hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Button>
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-primary/20 text-white">
          {firstLetter}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium text-white">{patientName || "Unknown Patient"}</h3>
        <p className="text-sm text-white/80">{patientPhone || "No phone number"}</p>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPatientInfo(true)}
          className="hover:bg-white/20 text-white rounded-full w-10 h-10"
        >
          <Info className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowReports(true)}
          className="hover:bg-white/20 text-white rounded-full w-10 h-10"
        >
          <FileText className="w-5 h-5" />
        </Button>
      </div>
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} userId={patientId} />
      <Dialog open={showPatientInfo} onOpenChange={setShowPatientInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Information</DialogTitle>
          </DialogHeader>
          <PatientInfoCard 
            patientId={patientId}
            complaint=""
            reportsCount={0}
            fullName={patientName || ""}
            age=""
            gender=""
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};