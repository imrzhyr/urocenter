import { Message } from "@/types/profile";
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
    <div className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-lg p-3 space-y-1 shadow-sm break-words ${
      fromCurrentUser
        ? "bg-[#0066CC] text-white"
        : "bg-white dark:bg-[#1A2433] dark:border dark:border-gray-700/50 text-gray-800 dark:text-white"
    }`}>
      {message.file_url && message.file_type?.startsWith('audio/') ? (
        <AudioPlayer
          audioUrl={message.file_url}
          messageId={message.id}
          duration={message.duration}
        />
      ) : message.file_url && (message.file_type?.startsWith('image/') || message.file_type?.startsWith('video/')) ? (
        <MediaGallery
          url={message.file_url}
          type={message.file_type}
          name={message.file_name || ''}
        />
      ) : null}
      
      {message.content && (
        <p className="text-sm break-words whitespace-pre-wrap overflow-wrap-anywhere">
          {message.content}
        </p>
      )}
      
      <div className="flex items-center justify-end gap-1 mt-1">
        <span className={`text-xs ${fromCurrentUser ? "text-white/80" : "text-gray-600 dark:text-gray-300"}`}>
          {format(new Date(message.created_at), 'HH:mm')}
        </span>
        {fromCurrentUser && <MessageStatus message={message} />}
      </div>
    </div>
  );
};