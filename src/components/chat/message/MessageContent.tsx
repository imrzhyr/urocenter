import { Message } from "@/types/profile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MessageStatus } from "../MessageStatus";
import { AudioPlayer } from "../audio/AudioPlayer";
import { MediaGallery } from "@/features/chat/components/MediaGallery/MediaGallery";

interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
}

export const MessageContent = ({ message, fromCurrentUser }: MessageContentProps) => {
  return (
    <div 
      className={cn(
        // Base styles
        "max-w-[280px] sm:max-w-[320px] md:max-w-[380px]",
        "rounded-2xl p-3 space-y-2",
        "shadow-sm break-words",
        "min-h-[44px]", // Minimum touch target height
        // Conditional styles based on sender
        fromCurrentUser
          ? "bg-[#0066CC] text-white ml-auto" 
          : "bg-[#F2F2F7] dark:bg-[#1C1C1E] text-[#1C1C1E] dark:text-white",
        // Additional styles for proper spacing
        "relative",
        "first:mt-4 last:mb-4"
      )}
    >
      {/* Audio message */}
      {message.file_url && message.file_type?.startsWith('audio/') && (
        <div className="min-h-[44px]"> {/* Minimum touch target */}
          <AudioPlayer
            audioUrl={message.file_url}
            messageId={message.id}
            duration={message.duration}
          />
        </div>
      )}
      
      {/* Image/Video message */}
      {message.file_url && (message.file_type?.startsWith('image/') || message.file_type?.startsWith('video/')) && (
        <div className="mb-2">
          <MediaGallery
            url={message.file_url}
            type={message.file_type}
            name={message.file_name || ''}
          />
        </div>
      )}
      
      {/* Text content */}
      {message.content && (
        <p className={cn(
          "text-base leading-relaxed", // 16px base size for readability
          "whitespace-pre-wrap break-words overflow-wrap-anywhere",
          "select-text" // Allow text selection
        )}>
          {message.content}
        </p>
      )}
      
      {/* Message metadata */}
      <div className={cn(
        "flex items-center gap-2 mt-1",
        "text-xs leading-none", // 11px minimum for legibility
        fromCurrentUser ? "justify-end" : "justify-start"
      )}>
        <span className={cn(
          fromCurrentUser 
            ? "text-white/80" 
            : "text-gray-500 dark:text-gray-400"
        )}>
          {format(new Date(message.created_at), 'HH:mm')}
        </span>
        {fromCurrentUser && <MessageStatus message={message} />}
      </div>
    </div>
  );
};