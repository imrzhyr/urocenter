import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IncomingCallControls } from "./IncomingCallControls";
import { Avatar } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface IncomingCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callerId: string;
  callerName: string;
  callId: string;
}

export const IncomingCallDialog = ({
  open,
  onOpenChange,
  callerId,
  callerName,
  callId,
}: IncomingCallDialogProps) => {
  const navigate = useNavigate();

  const handleAcceptCall = async () => {
    try {
      console.log('Accepting call with ID:', callId);
      
      const { error } = await supabase
        .from('calls')
        .update({ 
          status: 'connected',
          started_at: new Date().toISOString()
        })
        .eq('id', callId);

      if (error) {
        console.error('Error accepting call:', error);
        toast.error('Could not accept call');
        return;
      }

      console.log('Call accepted successfully, navigating to call page');
      onOpenChange(false);
      navigate(`/call/${callerId}`);
    } catch (error) {
      console.error('Error in handleAcceptCall:', error);
      toast.error('Failed to accept call');
    }
  };

  const handleRejectCall = async () => {
    try {
      console.log('Rejecting call with ID:', callId);
      
      const { error } = await supabase
        .from('calls')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', callId);

      if (error) {
        console.error('Error rejecting call:', error);
        toast.error('Could not reject call');
        return;
      }

      console.log('Call rejected successfully');
      onOpenChange(false);
      toast.success('Call rejected');
    } catch (error) {
      console.error('Error in handleRejectCall:', error);
      toast.error('Failed to reject call');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-4 pt-4">
          <Avatar className="h-20 w-20">
            <span className="text-2xl">{callerName[0]}</span>
          </Avatar>
          <div className="text-center">
            <h2 className="text-lg font-semibold">{callerName}</h2>
            <p className="text-sm text-muted-foreground">Incoming call...</p>
          </div>
          <IncomingCallControls
            onAccept={handleAcceptCall}
            onReject={handleRejectCall}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};