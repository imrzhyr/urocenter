import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PatientMessage } from "@/types/messages";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  patient: PatientMessage;
  index: number;
  onPatientClick: (patientId: string) => void;
}

export const MessageItem = ({ patient, index, onPatientClick }: MessageItemProps) => {
  const getStatusConfig = () => {
    switch (patient.status) {
      case 'seen':
        return {
          label: 'seen',
          className: 'bg-green-500 hover:bg-green-600'
        };
      case 'not_seen':
        return {
          label: patient.unread_count > 0 ? 'new' : 'not_seen',
          className: patient.unread_count > 0 ? 'bg-[#FF3B30] hover:bg-[#FF453A]' : 'bg-[#FF9500] hover:bg-[#FF9F0A]'
        };
      default:
        return {
          label: patient.status,
          className: 'bg-gray-500 hover:bg-gray-600'
        };
    }
  };

  const status = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Button
        variant="ghost"
        className="w-full justify-start p-4 h-auto hover:bg-primary/5 transition-all duration-300"
        onClick={() => onPatientClick(patient.id)}
      >
        <div className="flex items-start gap-3 w-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10">
              {patient.full_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <span className="font-medium text-base">{patient.full_name}</span>
              <div className="flex items-center gap-2">
                {patient.is_resolved && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    resolved
                  </span>
                )}
                <span className={cn(
                  "text-xs text-white px-2 py-1 rounded-full",
                  status.className
                )}>
                  {status.label}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {patient.last_message}
            </p>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(patient.last_message_time).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Button>
    </motion.div>
  );
};