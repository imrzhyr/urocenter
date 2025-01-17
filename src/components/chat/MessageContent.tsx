import { Message } from "@/types/profile";
import { format } from "date-fns";
import { MessageStatus } from "./MessageStatus";
import { MediaGallery } from "./media/MediaGallery";
import { ReferencedMessage } from "./ReferencedMessage";
import { VoicePlayer } from "./voice/VoicePlayer";

interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
}

export const MessageContent = ({ message, fromCurrentUser }: MessageContentProps) => {
  const isVoiceMessage = message.file_type === 'audio/webm';

  return (
    <div className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-lg p-3 space-y-1 shadow-sm break-words ${
      fromCurrentUser
        ? "bg-[#0066CC] text-white ml-auto" 
        : "bg-white dark:bg-[#1A2433] dark:border dark:border-gray-700/50 text-gray-800 dark:text-white"
    }`}>
      {message.referenced_message && (
        <ReferencedMessage message={message.referenced_message} />
      )}
      
      {message.file_url && !isVoiceMessage && (message.file_type?.startsWith('image/') || message.file_type?.startsWith('video/')) && (
        <MediaGallery
          url={message.file_url}
          type={message.file_type}
          name={message.file_name || ''}
        />
      )}

      {isVoiceMessage && message.file_url && (
        <VoicePlayer
          url={message.file_url}
          duration={message.duration || 0}
          className={fromCurrentUser ? "bg-[#0055AA]" : ""}
        />
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