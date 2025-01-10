import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallSetup } from "@/hooks/useCallSetup";
import { toast } from "sonner";

interface CallButtonProps {
  receiverId: string;
  disabled?: boolean;
}

export const CallButton = ({ receiverId, disabled }: CallButtonProps) => {
  const { initiateCall, isLoading } = useCallSetup();

  const handleCall = async () => {
    try {
      await initiateCall(receiverId);
    } catch (error) {
      console.error('Error initiating call:', error);
      toast.error("Failed to initiate call");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCall}
      disabled={disabled || isLoading}
      className="rounded-full hover:bg-white/20"
    >
      <Phone className="h-5 w-5 text-white" />
    </Button>
  );
};