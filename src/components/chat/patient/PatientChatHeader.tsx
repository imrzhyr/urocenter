import { User, ArrowLeft, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { ViewReportsDialog } from "@/components/medical-reports/ViewReportsDialog";
import { useState } from "react";

export const PatientChatHeader = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [showReports, setShowReports] = useState(false);

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
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
            <AvatarImage src="/lovable-uploads/eec1d792-9f5f-43ca-9c3c-ff7833f986ff.png" alt="Dr. Ali Kamal" />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-white">Dr. Ali Kamal</h3>
            <p className="text-sm text-white/80">Medical Consultation</p>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowReports(true)}
        className="gap-2 hover:bg-white/20 text-white"
      >
        <FileText className="w-4 h-4" />
        Reports
      </Button>
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} userId={profile?.id} />
    </div>
  );
};