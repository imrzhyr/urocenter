import { Button } from "@/components/ui/button";
import { Phone, CheckCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePatientProfile } from "@/hooks/usePatientProfile";
import { useChatStatus } from "@/hooks/useChatStatus";
import { useCallActions } from "../call/hooks/useCallActions";

export const DoctorChatHeader = ({
  patientId,
  patientName,
  patientPhone,
  onRefresh
}: {
  patientId: string;
  patientName: string;
  patientPhone?: string;
  onRefresh: () => void;
}) => {
  const queryClient = useQueryClient();
  const { initiateCall } = useCallActions(patientId);
  const { profile: patientProfile } = usePatientProfile(patientId);
  const { chatStatus } = useChatStatus(patientId);

  const handleCall = async () => {
    if (!patientProfile) {
      toast.error("Cannot initiate call: Patient profile not found");
      return;
    }
    await initiateCall(patientId, patientName);
  };

  const handleResolve = async () => {
    try {
      const { error: updateError } = await supabase
        .from("messages")
        .update({ is_resolved: !chatStatus })
        .eq("user_id", patientId);

      if (updateError) throw updateError;

      toast.success(!chatStatus ? "Chat marked as resolved" : "Chat marked as unresolved");
      queryClient.invalidateQueries({ queryKey: ["chat-status", patientId] });
      onRefresh();
    } catch (error) {
      console.error("Error updating resolution status:", error);
      toast.error("Failed to update chat status");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0066CC] text-white">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{patientName}</h2>
            {patientPhone && (
              <p className="text-sm text-gray-200">{patientPhone}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={handleCall}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`text-white h-8 w-8 ${
              chatStatus ? "bg-purple-500 hover:bg-purple-600" : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={handleResolve}
          >
            <CheckCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};