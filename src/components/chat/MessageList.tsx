import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { MediaGallery } from "./media/MediaGallery";
import { AudioPlayer } from "./audio/AudioPlayer";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { messageSound } from "@/utils/audioUtils";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  onReply?: (message: Message | null) => void;
  replyingTo?: Message | null;
}

export const MessageList = ({ messages, currentUserId, isLoading, onReply, replyingTo }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
    
    // Play sound when new message arrives
    if (messages.length > prevMessagesLength.current) {
      messageSound.play();
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const handleDragEnd = async (message: Message, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      await controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
      onReply?.(message);
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
    }
  };

  const getReplyPreview = (content: string, fileType?: string | null) => {
    if (fileType?.startsWith('audio/')) return '🎵 Voice message';
    if (fileType?.startsWith('image/')) return '📷 Photo';
    if (fileType?.startsWith('video/')) return '🎥 Video';
    return content.slice(0, 30) + (content.length > 30 ? '...' : '');
  };

  return (
    <ScrollArea className="flex-1 p-4 bg-[#ECE5DD] dark:bg-[#1A1F2C]">
      <div className="space-y-2">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => handleDragEnd(message, info)}
            animate={controls}
            className={`flex ${!message.is_from_doctor ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 space-y-1 shadow-sm ${
                !message.is_from_doctor
                  ? "bg-[#D6BCFA] dark:bg-[#7E69AB] text-black dark:text-white"
                  : "bg-[#E5DEFF] dark:bg-[#2A2A2A] text-black dark:text-white"
              }`}
            >
              {message.replyTo && (
                <div className="text-xs bg-black/5 dark:bg-white/5 rounded p-1 mb-1">
                  <div className="opacity-70">↩️ Replying to:</div>
                  <div className="truncate">{getReplyPreview(message.replyTo.content, message.replyTo.file_type)}</div>
                </div>
              )}
              
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
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {format(new Date(message.created_at), 'HH:mm')}
                </span>
                <MessageStatus message={message} />
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};