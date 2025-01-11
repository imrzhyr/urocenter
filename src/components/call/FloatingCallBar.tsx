import { Phone, PhoneOff } from "lucide-react";
import { formatDuration } from "@/utils/callUtils";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface FloatingCallBarProps {
  duration: number;
  onEndCall: () => void;
  userId: string;
}

export const FloatingCallBar = ({ duration, onEndCall, userId }: FloatingCallBarProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/call/${userId}`);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-primary text-white p-2 flex justify-between items-center z-50 cursor-pointer" onClick={handleClick}>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 animate-pulse" />
        <span className="text-sm font-medium">
          {formatDuration(duration)}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        className="hover:bg-primary-dark"
        onClick={(e) => {
          e.stopPropagation();
          onEndCall();
        }}
      >
        <PhoneOff className="h-4 w-4" />
      </Button>
    </div>
  );
};