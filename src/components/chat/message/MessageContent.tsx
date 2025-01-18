import { Message } from "@/types/profile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
      {message.content && (
        <p className="whitespace-pre-wrap">{message.content}</p>
      )}
      
      <div className="text-xs opacity-70 text-right mt-1">
        {format(new Date(message.created_at), 'HH:mm')}
      </div>
    </div>
  );
};