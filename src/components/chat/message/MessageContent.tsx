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
        "max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-lg p-3 space-y-1 shadow-sm break-words overflow-hidden",
        fromCurrentUser
          ? "bg-[#0066CC] text-white ml-auto" 
          : "bg-white dark:bg-[#1A2433] dark:border dark:border-gray-700/50 text-gray-800 dark:text-white"
      )}
    >
      {hasMedia && (
        <MediaGallery
          fileUrl={message.file_url}
          fileType={message.file_type}
          fileName={message.file_name}
          duration={message.duration}
          className="mb-2 w-full max-w-full"
        />
      )}
      
      {message.content && (
        <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
          {message.content}
        </p>
      )}
      
      <div className={`flex items-center gap-1 mt-1 ${fromCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <span className={`text-xs ${fromCurrentUser ? "text-white/80" : "text-gray-600 dark:text-gray-300"}`}>
          {messageTime}
        </span>
      </div>
    </div>
  );
};