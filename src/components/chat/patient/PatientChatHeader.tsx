import { useLanguage } from "@/contexts/LanguageContext";
import { CallButton } from "../CallButton";
import { useProfile } from "@/hooks/useProfile";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";
import { ViewReportsDialog } from "@/components/medical-reports/ViewReportsDialog";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [showReports, setShowReports] = useState(false);

  if (!profile?.id) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-primary">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h3 className="font-medium text-white">{t('doctor_name')}</h3>
          <p className="text-sm text-white/80">{t('doctor_title')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowReports(true)}
          className="text-white hover:bg-white/10 rounded-full"
        >
          <FileText className="h-5 w-5" />
        </Button>
        <CallButton userId={profile.id} />
      </div>
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} userId={profile.id} />
    </div>
  );
};