import { useEffect, useRef } from "react";
import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { MediaGallery } from "./media/MediaGallery";
import { AudioPlayer } from "./audio/AudioPlayer";

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

  return (
    <ScrollArea className="flex-1 p-4 bg-[#ECE5DD]">
      <div className="space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              !message.is_from_doctor ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 space-y-1 shadow-sm ${
                !message.is_from_doctor
                  ? "bg-[#DCF8C6] text-black"
                  : "bg-white text-black"
              }`}
            >
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
              
              {message.content && <p className="text-sm break-words">{message.content}</p>}
              
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs text-gray-500">
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