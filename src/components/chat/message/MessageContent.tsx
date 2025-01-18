import { Message } from "@/types/profile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MessageStatus } from "../MessageStatus";

interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
}

export const MessageContent = ({ message, fromCurrentUser }: MessageContentProps) => {
  return (
    <div className={cn(
      "max-w-[70%] break-words rounded-lg p-2",
      fromCurrentUser
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground"
    )}>
      <p className="whitespace-pre-wrap">{message.content}</p>
      
      <div className="flex items-center gap-1 mt-1 justify-end text-xs opacity-70">
        {format(new Date(message.created_at), 'HH:mm')}
        {fromCurrentUser && <MessageStatus message={message} />}
      </div>
    </div>
  );
};