import { Message } from "@/types/profile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MessageStatus } from "../MessageStatus";
import { AudioPlayer } from "../audio/AudioPlayer";
import { PhotoMessage } from "./PhotoMessage";

interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
}

export const MessageContent = ({ message, fromCurrentUser }: MessageContentProps) => {
  // Handle photo/video messages
  if ((message.file_urls && message.file_types) || (message.file_url && message.file_type)) {
    // Convert single file to array format
    const urls = message.file_urls || (message.file_url ? [message.file_url] : []);
    const types = message.file_types || (message.file_type ? [message.file_type] : []);
    const names = message.file_names || (message.file_name ? [message.file_name] : []);

    // Check if any of the files are images or videos
    if (types.some(type => type?.startsWith('image/') || type?.startsWith('video/'))) {
      console.log('Rendering photo message:', { urls, types, names });
      return (
        <PhotoMessage
          message={message}
          urls={urls}
          fileNames={names}
          content={message.content}
          timestamp={new Date(message.created_at)}
          fromCurrentUser={fromCurrentUser}
          showStatus={true}
        />
      );
    }
  }

  // Handle other message types
  return (
    <div 
      className={cn(
        // Base styles
        "max-w-[320px] sm:max-w-[380px] md:max-w-[440px]",
        "p-3",
        "shadow-sm break-words",
        "min-h-[44px]", // Minimum touch target height per iOS guidelines
        // Conditional styles based on sender
        fromCurrentUser
          ? "bg-[#0066CC] text-white ml-auto rounded-l-xl rounded-tr-xl rounded-br-none" // Sharper edges for sent messages
          : "bg-white text-[#1C1C1E] border-2 border-[#0066CC]/20 rounded-r-xl rounded-tl-none rounded-bl-xl", // Sharper edges for received messages
        // Additional styles for proper spacing
        "relative"
      )}
    >
      {/* Audio message */}
      {message.file_url && message.file_type?.startsWith('audio/') && (
        <div className="min-h-[44px]"> {/* Minimum touch target */}
          <AudioPlayer
            audioUrl={message.file_url}
            messageId={message.id}
            duration={message.duration}
            isUserMessage={fromCurrentUser}
          />
        </div>
      )}
      
      {/* Text content */}
      {message.content && (
        <>
          <p className={cn(
            "text-[15px] leading-[1.3]", // iOS standard message text size
            "whitespace-pre-wrap break-words overflow-wrap-anywhere",
            "select-text", // Allow text selection
            "px-0.5" // Slight padding for text
          )}>
            {message.content}
          </p>
          
          {/* Message metadata */}
          <div className={cn(
            "flex items-center gap-1.5 mt-1",
            "text-[11px] leading-none", // iOS minimum text size
            fromCurrentUser ? "justify-end" : "justify-start"
          )}>
            <span className={cn(
              fromCurrentUser ? "text-white/80" : "text-[#8E8E93]" // iOS secondary text color
            )}>
              {format(new Date(message.created_at), 'h:mm a')} {/* 12-hour format with am/pm */}
            </span>
            {fromCurrentUser && <MessageStatus message={message} />}
          </div>
        </>
      )}
    </div>
  );
};