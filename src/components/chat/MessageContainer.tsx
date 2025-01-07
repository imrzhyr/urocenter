import { useEffect, useRef } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message } from "@/types/profile";

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (message: string, fileInfo?: { url: string; name: string; type: string }) => void;
  isLoading: boolean;
  header: React.ReactNode;
}

export const MessageContainer = ({
  messages,
  onSendMessage,
  isLoading,
  header
}: MessageContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      <div className="p-4 bg-[#F0F2F5] border-b">
        {header}
      </div>
      <div className="flex-1 overflow-y-auto smooth-scroll content-visibility">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};