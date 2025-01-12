import { useEffect, useRef } from "react";
import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { MediaGallery } from "./media/MediaGallery";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
}

export const MessageList = ({ messages, currentUserId, isLoading }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const formatDuration = (duration?: number) => {
    if (!duration) return null;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.user_id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 space-y-2 ${
                message.user_id === currentUserId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.file_url && (message.file_type?.startsWith('image/') || message.file_type?.startsWith('video/')) && (
                <MediaGallery
                  url={message.file_url}
                  type={message.file_type}
                  name={message.file_name || ''}
                />
              )}
              
              <p className="text-sm">{message.content}</p>
              
              {message.duration && (
                <p className="text-xs opacity-70">
                  Duration: {formatDuration(message.duration)}
                </p>
              )}
              
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className="text-xs opacity-70">
                  {format(new Date(message.created_at), 'HH:mm')}
                </span>
                <MessageStatus message={message} />
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};
