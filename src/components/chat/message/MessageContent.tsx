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

  // Log the message details for debugging
  console.log('Message content:', {
    hasMedia,
    fileUrl: message.file_url,
    fileType: message.file_type,
    fileName: message.file_name
  });

  return (
    <div
      className={cn(
        "max-w-[70%] break-words rounded-lg p-2",
        fromCurrentUser
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
        hasMedia && "min-w-[200px]"
      )}
    >
      {hasMedia && (
        <div className="mb-2">
          {message.file_type?.startsWith('image/') ? (
            <img 
              src={message.file_url} 
              alt={message.file_name || 'Image'} 
              className="max-w-full rounded-lg"
              loading="lazy"
            />
          ) : message.file_type?.startsWith('video/') ? (
            <video 
              src={message.file_url} 
              controls 
              className="max-w-full rounded-lg"
            />
          ) : message.file_type?.startsWith('audio/') ? (
            <audio 
              src={message.file_url} 
              controls 
              className="w-full"
            />
          ) : (
            <div className="p-2 bg-background/10 rounded-lg">
              <a 
                href={message.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm underline"
              >
                {message.file_name || 'Download file'}
              </a>
            </div>
          )}
        </div>
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