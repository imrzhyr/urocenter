import { Message } from "@/types/profile";
import { cn } from "@/lib/utils";
import { MediaGallery } from "../media/MediaGallery";
import { format } from "date-fns";

interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
}

export const MessageContent = ({ message, fromCurrentUser }: MessageContentProps) => {
  const hasMedia = message.file_url && message.file_type;
  const messageTime = message.created_at ? format(new Date(message.created_at), 'HH:mm') : '';

  return (
    <div
      className={cn(
        "max-w-[85%] sm:max-w-[70%] break-words rounded-lg p-2",
        fromCurrentUser
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
        hasMedia && "min-w-[200px]"
      )}
    >
      {hasMedia && (
        <MediaGallery
          fileUrl={message.file_url}
          fileType={message.file_type}
          fileName={message.file_name}
          duration={message.duration}
          className="mb-2"
        />
      )}
      {message.content && (
        <p className="whitespace-pre-wrap">{message.content}</p>
      )}
      <div className="text-xs opacity-70 text-right mt-1">
        {messageTime}
      </div>
    </div>
  );
};