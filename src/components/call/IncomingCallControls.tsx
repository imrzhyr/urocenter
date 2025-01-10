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
        size="lg"
        className="flex flex-col items-center justify-center h-20 bg-green-50 hover:bg-green-100 border-green-200"
        onClick={onAccept}
      >
        <div className="flex flex-col items-center">
          <Phone className="h-6 w-6 mb-2 text-green-500" />
          <span className="text-sm">Accept</span>
        </div>
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="flex flex-col items-center justify-center h-20 bg-red-50 hover:bg-red-100 border-red-200"
        onClick={onReject}
      >
        <div className="flex flex-col items-center">
          <X className="h-6 w-6 mb-2 text-red-500" />
          <span className="text-sm">Reject</span>
        </div>
      </Button>
    </div>
  );
};