import { Message } from "@/types/profile";
import { cn } from "@/lib/utils";
import { MediaGallery } from "../media/MediaGallery";
import { format } from "date-fns";
import { AudioPlayer } from "../audio/AudioPlayer";

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
          ? "bg-[#015C4B] text-white ml-auto" 
          : "bg-[#1F2937] dark:bg-[#1F2937] dark:border dark:border-gray-700/50 text-white"
      )}
    >
      {hasMedia && message.file_type?.startsWith('audio/') ? (
        <AudioPlayer
          url={message.file_url}
          messageId={message.id}
          duration={message.duration}
        />
      ) : hasMedia && (message.file_type?.startsWith('image/') || message.file_type?.startsWith('video/')) ? (
        <div className="space-y-2">
          <MediaGallery
            fileUrl={message.file_url}
            fileType={message.file_type}
            fileName={message.file_name}
            messageId={message.id}
            duration={message.duration}
            className="mb-2 w-full max-w-full"
          />
          {message.file_name && (
            <p className="text-sm text-center text-white/80 font-normal leading-5">
              {message.file_name}
            </p>
          )}
        </div>
      ) : null}
      
      {message.content && (
        <p className="text-[15px] leading-[22px] font-normal whitespace-pre-wrap break-words overflow-wrap-anywhere">
          {message.content}
        </p>
      )}
      
      <div className={cn(
        "flex items-center gap-1 mt-1",
        fromCurrentUser ? "justify-end" : "justify-start"
      )}>
        <span className="text-[11px] leading-[13px] opacity-70">
          {messageTime}
        </span>
      </div>
    </div>
  );
};