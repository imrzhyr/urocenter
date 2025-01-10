import { useEffect, useRef } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message } from "@/types/profile";
import { ViewReportsDialog } from "@/features/medical/components/ViewReportsDialog";
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
    <div className="flex flex-col h-[100vh] w-full">
      <div className="bg-primary text-white sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex-1 min-w-0">
            {header}
          </div>
          <CallButton userId={userId} className="text-white hover:bg-white/10" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 bg-white border-t shadow-sm">
        <div className="px-4 py-3">
          <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} />
    </div>
  );
};
