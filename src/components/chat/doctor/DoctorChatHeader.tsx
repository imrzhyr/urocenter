import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { FileText, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewReportsDialog } from "@/components/medical-reports/ViewReportsDialog";
import { useState } from "react";
import { AudioCall } from "@/components/call/AudioCall";
import { callState } from "@/features/call/CallState";
import { callSignaling } from "@/features/call/CallSignaling";

interface DoctorChatHeaderProps {
  patientName: string;
  patientPhone: string;
  onRefresh: () => void;
  patientId: string;
}

export const DoctorChatHeader = ({ 
  patientName, 
  patientPhone,
  onRefresh,
  patientId
}: DoctorChatHeaderProps) => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [showReports, setShowReports] = useState(false);
  const [showCall, setShowCall] = useState(false);

  if (!profile?.id) return null;

  const handleCallClick = () => {
    // Only initialize call if we're in idle state
    if (callState.getStatus() === 'idle') {
      console.log('Initializing call to:', patientId);
      callState.setStatus('ringing');
      callSignaling.initialize(patientId);
      setShowCall(true);
    } else {
      console.log('Call already in progress or not in idle state');
    }
  };

  const handleCallEnded = () => {
    setShowCall(false);
    // Reset call state to idle
    callState.setStatus('idle');
    // Cleanup signaling
    callSignaling.cleanup();
  };

  return (
    <>
      <div className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <BackButton />
          <div>
            <h3 className="font-medium text-white text-sm">
              {patientName || t('unknown_patient')}
            </h3>
            <p className="text-xs text-white/80">{patientPhone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-primary-foreground/10 h-8 w-8"
            onClick={() => setShowReports(true)}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-primary-foreground/10 h-8 w-8"
            onClick={handleCallClick}
          >
            <PhoneCall className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ViewReportsDialog 
        open={showReports} 
        onOpenChange={setShowReports}
        userId={patientId}
      />

      {showCall && (
        <AudioCall 
          recipientId={patientId}
          onCallEnded={handleCallEnded}
        />
      )}
    </>
  );
};