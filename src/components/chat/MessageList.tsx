import { useEffect, useRef } from "react";
import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { MediaGallery } from "./media/MediaGallery";
import { AudioPlayer } from "./audio/AudioPlayer";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { messageSound } from "@/utils/audioUtils";
import { useProfile } from "@/hooks/useProfile";

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
  const { profile } = useProfile();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
    
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

  const isFromCurrentUser = (message: Message) => {
    if (profile?.role === 'admin') {
      return message.is_from_doctor;
    }
    return !message.is_from_doctor;
  };

  const renderReplyPreview = (replyTo: NonNullable<Message['replyTo']>) => {
    if (!replyTo) return null;

    return (
      <div className="text-xs bg-black/5 dark:bg-white/5 rounded p-2 mb-2 border-l-2 border-[#0066CC]">
        <div className="opacity-70 flex items-center gap-1">
          <span>↩️ Replying to:</span>
          <span className="font-medium">{replyTo.sender_name || 'Unknown'}</span>
        </div>
        <div className="truncate font-medium mt-1">
          {getMessagePreview(replyTo)}
        </div>
      </div>
    );
  };

  const getMessagePreview = (message: { content: string; file_type?: string | null }) => {
    if (!message.content && !message.file_type) return 'Message not available';
    if (message.file_type?.startsWith('audio/')) return '🎵 Voice message';
    if (message.file_type?.startsWith('image/')) return '📷 Photo';
    if (message.file_type?.startsWith('video/')) return '🎥 Video';
    return message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
  };

  return (
    <ScrollArea className="flex-1 p-4 chat-background">
      <div className="space-y-4 max-w-[1100px] mx-auto">
        {messages.map((message) => {
          const fromCurrentUser = isFromCurrentUser(message);
          
          return (
            <motion.div
              key={message.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => handleDragEnd(message, info)}
              animate={controls}
              className={`flex flex-col ${fromCurrentUser ? "items-end" : "items-start"}`}
            >
              {message.sender_name && (
                <span className={`text-sm mb-1 px-2 ${
                  fromCurrentUser ? "text-right text-[#0066CC]" : "text-left text-gray-600"
                }`}>
                  {message.sender_name}
                </span>
              )}
              
              <div className={`max-w-[70%] sm:max-w-[65%] md:max-w-[600px] rounded-lg p-3 space-y-1 shadow-sm ${
                fromCurrentUser
                  ? "bg-[#0066CC] text-white"
                  : "bg-white dark:bg-[#1A2433] text-gray-800 dark:text-white"
              }`}>
                {message.replyTo && renderReplyPreview(message.replyTo)}
                
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
                  <span className={`text-xs ${fromCurrentUser ? "text-white/80" : "text-gray-600 dark:text-gray-300"}`}>
                    {format(new Date(message.created_at), 'HH:mm')}
                  </span>
                  {fromCurrentUser && <MessageStatus message={message} />}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};