import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { MediaGallery } from "./media/MediaGallery";
import { AudioPlayer } from "./audio/AudioPlayer";
import { motion, useAnimation, PanInfo } from "framer-motion";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
}

export const MessageList = ({ messages, currentUserId, isLoading }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const handleDragEnd = async (message: Message, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      await controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
      setReplyingTo(message);
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
    }
  };

  return (
    <ScrollArea className="flex-1 p-4 bg-[#ECE5DD] dark:bg-[#1A1F2C]">
      {replyingTo && (
        <div className="fixed bottom-[72px] left-0 right-0 bg-[#E5DEFF] dark:bg-[#2A2A2A] p-3 animate-fade-in border-t border-[#D6BCFA] dark:border-[#3A3A3A]">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-12 bg-[#8B5CF6] rounded-full" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Replying to {replyingTo.is_from_doctor ? 'Doctor' : 'Message'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                  {replyingTo.content}
                </p>
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => handleDragEnd(message, info)}
            animate={controls}
            className={`flex ${
              !message.is_from_doctor ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 space-y-1 shadow-sm ${
                !message.is_from_doctor
                  ? "bg-[#D6BCFA] dark:bg-[#7E69AB] text-black dark:text-white"
                  : "bg-[#E5DEFF] dark:bg-[#2A2A2A] text-black dark:text-white"
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