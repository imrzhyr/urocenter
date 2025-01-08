import { useEffect, useRef } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ViewReportsDialog } from "../medical-reports/ViewReportsDialog";
import { useState } from "react";

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (message: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => void;
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
  const [showReports, setShowReports] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <div className="p-4 bg-primary text-white">
        <div className="flex items-center justify-between">
          {header}
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => setShowReports(true)}
          >
            <FileText className="w-4 h-4" />
            Medical Reports
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto smooth-scroll content-visibility bg-gray-50">
        <div className="py-4">
          <div className="text-center mb-6">
            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
              TODAY
            </span>
          </div>
          <MessageList messages={messages} />
        </div>
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
      <ViewReportsDialog open={showReports} onOpenChange={setShowReports} />
    </div>
  );
};