import { User, ArrowLeft, FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ViewReportsDialog } from "@/components/medical-reports/ViewReportsDialog";

interface DoctorChatHeaderProps {
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  onRefresh: () => Promise<void>;
}

export const DoctorChatHeader = ({ patientName, patientPhone, onRefresh }: DoctorChatHeaderProps) => {
  const navigate = useNavigate();
  const [showReports, setShowReports] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate("/admin")}
        className="rounded-full hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Button>
      <Avatar className="h-10 w-10">
        <AvatarFallback>
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium text-white">{patientName || "Unknown Patient"}</h3>
        <p className="text-sm text-white/80">{patientPhone || "No phone number"}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowReports(true)}
        className="ml-auto hover:bg-white/20 text-white rounded-full w-10 h-10"
      >
        <FileText className="w-5 h-5" />
      </Button>
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} />
    </div>
  );
};