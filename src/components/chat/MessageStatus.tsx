import { Message } from "@/types/profile";
import { Check, CheckCheck } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface MessageStatusProps {
  message: Message;
}

export const MessageStatus = ({ message }: MessageStatusProps) => {
  const { profile } = useProfile();
  
  const isFromCurrentUser = profile?.role === 'admin' ? message.is_from_doctor : !message.is_from_doctor;
  
  // Only show status for messages sent by the current user
  if (!isFromCurrentUser) {
    return null;
  }

  if (message.seen_at) {
    return <CheckCheck className="w-3 h-3 text-blue-500 shrink-0" />;
  } else if (message.delivered_at) {
    return <CheckCheck className="w-3 h-3 text-gray-400 shrink-0" />;
  } else {
    return <Check className="w-3 h-3 text-gray-400 shrink-0" />;
  }
};