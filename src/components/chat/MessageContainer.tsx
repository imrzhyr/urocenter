import React, { useRef, useState } from "react";
import { Message } from "@/types/profile";
import { MessageList } from "./MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { cn } from "@/lib/utils";

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => void;
  isLoading?: boolean;
  header?: React.ReactNode;
  userId?: string;
}

export const MessageContainer = ({
  messages,
  onSendMessage,
  isLoading,
  header,
  userId
}: MessageContainerProps) => {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (
    content: string, 
    fileInfo?: { url: string; name: string; type: string; duration?: number },
    replyTo?: Message
  ) => {
    try {
      // Send the file info directly without any JSON transformation
      await onSendMessage(
        content,
        fileInfo ? {
          url: fileInfo.url,
          name: fileInfo.name,
          type: fileInfo.type,
          duration: fileInfo.duration
        } : undefined,
        replyTo
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {header}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 overflow-y-auto",
          "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700",
          "scrollbar-track-transparent"
        )}
      >
        <MessageList 
          messages={messages}
          onReply={setReplyingTo}
          currentUserId={userId || ''}
        />
        <TypingIndicator typingUsers={[]} />
      </div>
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </div>
  );
};