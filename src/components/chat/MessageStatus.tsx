import { Message } from "@/types/profile";
import { Check, CheckCheck } from "lucide-react";

interface MessageStatusProps {
  message: Message;
}

export const MessageStatus = ({ message }: MessageStatusProps) => {
  if (!message.is_from_doctor) {
    if (message.seen_at) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    } else if (message.delivered_at) {
      return <CheckCheck className="w-4 h-4 text-gray-500" />;
    } else {
      return <Check className="w-4 h-4 text-gray-500" />;
    }
  }
  return null;
};