import { PatientInfoContainer } from "../PatientInfoContainer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DoctorChatHeaderProps {
  patientId?: string;
}

export const DoctorChatHeader = ({ patientId }: DoctorChatHeaderProps) => {
  const navigate = useNavigate();
  const [isResolved, setIsResolved] = useState(false);

  const toggleResolved = async () => {
    if (!patientId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          is_resolved: !isResolved,
          status: !isResolved ? 'resolved' : 'in_progress'
        })
        .eq('user_id', patientId);

      if (error) throw error;

      setIsResolved(!isResolved);
      toast.success(isResolved ? 'Chat marked as unresolved' : 'Chat marked as resolved');
    } catch (error) {
      console.error('Error updating chat status:', error);
      toast.error('Failed to update chat status');
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PatientInfoContainer patientId={patientId} />
      </div>
      <Button
        variant={isResolved ? "secondary" : "ghost"}
        size="sm"
        onClick={toggleResolved}
        className="gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        {isResolved ? 'Resolved' : 'Mark as Resolved'}
      </Button>
    </div>
  );
};