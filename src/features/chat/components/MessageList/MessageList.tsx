import { useEffect, useRef } from "react";
import { Message } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PanInfo } from "framer-motion";
import { messageSound } from "@/utils/audioUtils";
import { useProfile } from "@/hooks/useProfile";
import { MessageItem } from "../MessageItem/MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  onReply?: (message: Message | null) => void;
  replyingTo?: Message | null;
}

export const MessageList = ({ messages, currentUserId, onReply }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const { profile } = useProfile();
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    if (messages.length > prevMessagesLength.current) {
      messageSound.play();
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const handleDragEnd = async (message: Message, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      onReply?.(message);
    }
  };

  const isFromCurrentUser = (message: Message) => {
    if (profile?.role === 'admin') {
      return message.is_from_doctor;
    }
    return !message.is_from_doctor;
  };

  return (
    <ScrollArea className="flex-1 chat-background">
      <div className="flex flex-col space-y-2 py-4 px-2 sm:px-4 min-h-full w-full overflow-x-hidden">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            fromCurrentUser={isFromCurrentUser(message)}
            onDragEnd={handleDragEnd}
          />
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};