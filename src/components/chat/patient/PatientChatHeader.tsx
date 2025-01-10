import { User, ArrowLeft, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { ViewReportsDialog } from "@/components/medical-reports/ViewReportsDialog";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CallButton } from "@/components/chat/CallButton";

export const PatientChatHeader = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [showReports, setShowReports] = useState(false);
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className={`rounded-full hover:bg-white/20 ${isRTL ? 'rotate-180' : ''}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <Avatar className="h-10 w-10 ring-2 ring-white/20">
          <AvatarImage src="/lovable-uploads/eec1d792-9f5f-43ca-9c3c-ff7833f986ff.png" alt="Dr. Ali Kamal" />
          <AvatarFallback>
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="whitespace-nowrap">
          <h3 className="font-medium text-white">Dr. Ali Kamal</h3>
          <p className="text-sm text-white/80">Urologist Consultant</p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowReports(true)}
          className="hover:bg-white/20 text-white rounded-full w-10 h-10"
        >
          <FileText className="w-5 h-5" />
        </Button>
        <CallButton userId={profile?.id || ''} className="text-white" />
      </div>
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} />
    </div>
  );
};