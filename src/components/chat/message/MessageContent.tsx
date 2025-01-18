import { Message } from "@/types/profile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MessageStatus } from "../MessageStatus";
import { AudioPlayer } from "../audio/AudioPlayer";
import { MediaGallery } from "../media/MediaGallery";

interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
}

export const MessageContent = ({ message, fromCurrentUser }: MessageContentProps) => {
  return (
    <div className={cn(
      "max-w-[120px] sm:max-w-[120px] md:max-w-[120px] rounded-lg p-2 space-y-1 shadow-sm break-words",
      fromCurrentUser
        ? "bg-[#0066CC] text-white ml-auto" 
        : "bg-white dark:bg-[#1A2433] dark:border dark:border-gray-700/50 text-gray-800 dark:text-white"
    )}>
      {message.file_url && message.file_type?.startsWith('audio/') && (
        <AudioPlayer
          audioUrl={message.file_url}
          messageId={message.id}
          duration={message.duration}
        />
      )}
      
      {message.file_url && (message.file_type?.startsWith('image/') || message.file_type?.startsWith('video/')) && (
        <div className="mb-2 max-w-[120px]">
          <MediaGallery
            url={message.file_url}
            type={message.file_type}
            name={message.file_name || ''}
          />
        </div>
      )}
      
      {message.content && (
        <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
          {message.content}
        </p>
      )}
      
      <div className={`flex items-center gap-1 mt-1 ${fromCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <span className={`text-xs ${fromCurrentUser ? "text-white/80" : "text-gray-600 dark:text-gray-300"}`}>
          {format(new Date(message.created_at), 'HH:mm')}
        </span>
        {fromCurrentUser && <MessageStatus message={message} />}
      </div>
    </div>
  );
};