import { Message } from "@/types/profile";
import { format } from "date-fns";
import { MessageStatus } from "../MessageStatus";

interface TextMessageProps {
  message: Message;
}

export const TextMessage = ({ message }: TextMessageProps) => {
  return (
    <div className="space-y-1">
      <p className="text-[15px] leading-[1.3] whitespace-pre-wrap break-words">
        {message.content}
      </p>
      <div className="flex items-center gap-1.5 text-[11px] justify-end text-white/80">
        <span>{format(new Date(message.created_at), 'h:mm a')}</span>
        <MessageStatus message={message} />
      </div>
    </div>
  );
};