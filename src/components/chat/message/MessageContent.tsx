import { Message } from "@/types/profile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AudioPlayer } from "../audio/AudioPlayer";
import { PhotoMessage } from "./PhotoMessage";
import { memo } from 'react';

interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
}

export const MessageContent = memo(({ message, fromCurrentUser }: MessageContentProps) => {
  // Handle media messages (photos, videos, audio)
  if (message.file_url && message.file_type) {
    // Handle images and videos
    if (message.file_type.startsWith('image/') || message.file_type.startsWith('video/')) {
      return (
        <PhotoMessage
          urls={[message.file_url]}
          fileNames={[message.file_name || '']}
          content={message.content}
          timestamp={new Date(message.created_at)}
          fromCurrentUser={fromCurrentUser}
          showStatus={true}
        />
      );
    }

    // Handle audio messages
    if (message.file_type.startsWith('audio/')) {
      return (
        <div className="min-h-[44px] rounded-lg overflow-hidden">
          <AudioPlayer
            audioUrl={message.file_url}
            messageId={message.id}
            duration={message.duration}
            isUserMessage={fromCurrentUser}
          />
        </div>
      );
    }
  }

  // Text messages
  return (
    <div 
      className={cn(
        "max-w-[320px] sm:max-w-[380px] md:max-w-[440px]",
        "p-3.5",
        "shadow-lg",
        "min-h-[44px]",
        "backdrop-blur-xl",
        "backdrop-saturate-150",
        "bg-gradient-to-br",
        fromCurrentUser
          ? "from-[#0A84FF] to-[#0066CC] text-white ml-auto rounded-[20px] rounded-tr-[4px]"
          : "from-white/90 to-white/80 dark:from-white/20 dark:to-white/10 text-gray-900 dark:text-white mr-auto rounded-[20px] rounded-tl-[4px]"
      )}>
      {message.content && (
        <>
          <p className={cn(
            "text-[15px] leading-[1.4]",
            "whitespace-pre-wrap break-words",
            fromCurrentUser ? "text-white/95" : "text-gray-900 dark:text-white/90"
          )}>
            {message.content}
          </p>
          
          <div className={cn(
            "flex items-center gap-1.5 mt-1.5",
            "text-[11px]",
            fromCurrentUser ? "justify-end" : "justify-start"
          )}>
            <span className={fromCurrentUser ? "text-white/70" : "text-gray-500/70 dark:text-gray-400/70"}>
              {format(new Date(message.created_at), 'h:mm a')}
            </span>
          </div>
        </>
      )}
    </div>
  );
});