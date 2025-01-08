import { useEffect, useState } from "react";
import { User, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ViewReportsDialog } from "@/components/medical-reports/ViewReportsDialog";
import { toast } from "sonner";

interface DoctorChatHeaderProps {
  patientId?: string;
}

export const DoctorChatHeader = ({ patientId }: DoctorChatHeaderProps) => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");
  const [showReports, setShowReports] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      if (!patientId) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', patientId)
        .single();

      if (profile) {
        setPatientName(profile.full_name || 'Anonymous Patient');
      }

      const { data: messages } = await supabase
        .from('messages')
        .select('is_resolved')
        .eq('user_id', patientId)
        .limit(1)
        .single();

      if (messages) {
        setIsResolved(messages.is_resolved || false);
      }
    };

    fetchPatientInfo();
  }, [patientId]);

  const toggleResolved = async () => {
    if (!patientId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_resolved: !isResolved })
        .eq('user_id', patientId);

      if (error) throw error;

      setIsResolved(!isResolved);
      toast.success(isResolved ? 'Chat marked as unresolved' : 'Chat marked as resolved');
    } catch (error) {
      console.error('Error updating resolved status:', error);
      toast.error('Failed to update chat status');
    }
  };

  return (
    <div className="flex items-center justify-between bg-primary/95 backdrop-blur-sm p-4 rounded-b-2xl shadow-md">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-white">{patientName}</h3>
            <p className="text-sm text-white/80">Patient Consultation</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleResolved}
          className={`gap-2 hover:bg-white/20 ${isResolved ? 'text-green-300' : 'text-white'}`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {isResolved ? 'Resolved' : 'Mark as Resolved'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReports(true)}
          className="gap-2 hover:bg-white/20 text-white"
        >
          <FileText className="w-4 h-4" />
          Reports
        </Button>
      </div>
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} userId={patientId} />
    </div>
  );
};