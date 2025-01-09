import { useEffect, useRef } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message } from "@/types/profile";
import { ViewReportsDialog } from "../medical-reports/ViewReportsDialog";
import { useState } from "react";
import { CallButton } from "./CallButton";

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (message: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => void;
  isLoading: boolean;
  header: React.ReactNode;
  userId: string;
}

export const MessageContainer = ({
  messages,
  onSendMessage,
  isLoading,
  header,
  userId
}: MessageContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showReports, setShowReports] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[100vh] w-full bg-white">
      <div className="p-4 bg-primary text-white shadow-md">
        <div className="container mx-auto max-w-4xl flex justify-between items-center gap-4">
          <div className="flex-1 min-w-0">
            {header}
          </div>
          <CallButton userId={userId} className="text-white hover:bg-white/10" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto smooth-scroll content-visibility bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="py-4">
            <div className="text-center mb-6">
              <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                TODAY
              </span>
            </div>
            <MessageList messages={messages} />
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="container mx-auto max-w-4xl">
        <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} />
    </div>
  );
};