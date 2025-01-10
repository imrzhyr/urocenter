import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/utils/callUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface CallHeaderProps {
  onBack: () => void;
  duration: number;
  callStatus: string;
}

export const CallHeader = ({ onBack, duration, callStatus }: CallHeaderProps) => {
  const { language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowRight : ArrowLeft;
  
  return (
    <div className={`flex justify-between items-center mb-8 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="hover:bg-primary/10"
      >
        <ArrowIcon className="h-6 w-6" />
      </Button>
      {callStatus === 'connected' && (
        <span className="text-lg font-semibold text-primary animate-pulse">
          {formatDuration(duration)}
        </span>
      )}
    </div>
  );
};