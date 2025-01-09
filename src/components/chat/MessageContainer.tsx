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
    <div className="flex flex-col h-[100vh] w-full bg-gray-50">
      <div className="p-6 bg-primary text-white shadow-md">
        <div className="container mx-auto max-w-6xl flex justify-between items-center gap-6">
          <div className="flex-1 min-w-0">
            {header}
          </div>
          <CallButton userId={userId} className="text-white hover:bg-white/10" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto smooth-scroll content-visibility bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="py-8">
            <MessageList messages={messages} />
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="container mx-auto max-w-6xl bg-white border-t py-4">
        <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} />
    </div>
  );
};