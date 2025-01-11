import { useNavigate } from "react-router-dom";
import { Phone, PhoneOff } from "lucide-react";
import { formatDuration } from "@/utils/callUtils";
import { motion } from "framer-motion";
import { CallingUser } from "@/types/call";

interface PersistentCallBarProps {
  duration: number;
  callingUser: CallingUser | null;
  onEndCall: () => void;
  callId: string;
}

export const PersistentCallBar = ({
  duration,
  callingUser,
  onEndCall,
  callId,
}: PersistentCallBarProps) => {
  const navigate = useNavigate();

  const handleCallClick = () => {
    navigate(`/call/${callingUser?.id}`);
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-primary z-50 px-4 py-2 shadow-lg"
    >
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={handleCallClick}
        >
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              {callingUser?.full_name || "Unknown"}
            </span>
          </div>
          <span className="text-sm text-primary-foreground/80">
            {formatDuration(duration)}
          </span>
        </div>
        <button
          onClick={onEndCall}
          className="p-2 hover:bg-red-500 rounded-full transition-colors"
        >
          <PhoneOff className="h-4 w-4 text-primary-foreground" />
        </button>
      </div>
    </motion.div>
  );
};