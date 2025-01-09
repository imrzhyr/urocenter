import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageStatusBadge } from "@/components/chat/MessageStatusBadge";
import { PatientMessage } from "@/types/messages";
import { motion } from "framer-motion";

interface MessageItemProps {
  patient: PatientMessage;
  index: number;
  onPatientClick: (patientId: string) => void;
}

export const MessageItem = ({ patient, index, onPatientClick }: MessageItemProps) => {
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
                    Resolved
                  </span>
                )}
                <MessageStatusBadge 
                  status={patient.status} 
                  unreadCount={patient.unread_count}
                />
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