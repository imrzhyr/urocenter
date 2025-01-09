import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/utils/callUtils";

interface CallHeaderProps {
  onBack: () => void;
  duration: number;
  callStatus: string;
}

export const CallHeader = ({ onBack, duration, callStatus }: CallHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="hover:bg-primary/10"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      {callStatus === 'connected' && (
        <span className="text-lg font-semibold text-primary animate-pulse">
          {formatDuration(duration)}
        </span>
      )}
    </div>
  );
};