import { Button } from "@/components/ui/button";
import { Phone, X } from "lucide-react";

interface IncomingCallControlsProps {
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallControls = ({
  onAccept,
  onReject,
}: IncomingCallControlsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100"
        onClick={onAccept}
      >
        <Phone className="h-6 w-6 mb-2 text-green-500" />
        <span className="text-sm">Accept</span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100"
        onClick={onReject}
      >
        <X className="h-6 w-6 mb-2 text-red-500" />
        <span className="text-sm">Reject</span>
      </Button>
    </div>
  );
};