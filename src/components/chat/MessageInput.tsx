import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FileUploadButton } from "./media/FileUploadButton";
import { VoiceMessageRecorder } from "./VoiceMessageRecorder";
import { Message } from "@/types/profile";
import { ReplyPreview } from "./reply/ReplyPreview";
import { TextArea } from "./input/TextArea";

interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => void;
  isLoading?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  onTyping?: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
  replyingTo,
  onCancelReply,
  onTyping,
}) => {
  const [content, setContent] = useState("");
  const [fileInfo, setFileInfo] = useState<{ url: string; name: string; type: string } | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (content.trim() || fileInfo) {
      onSendMessage(content.trim(), fileInfo || undefined, replyingTo || undefined);
      setContent("");
      setFileInfo(null);
      if (onCancelReply) {
        onCancelReply();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (info: { url: string; name: string; type: string }) => {
    setFileInfo(info);
    // Automatically send the message if it's a file-only message
    if (!content.trim()) {
      onSendMessage("", info, replyingTo || undefined);
      setFileInfo(null);
      if (onCancelReply) {
        onCancelReply();
      }
    }
  };

  const handleVoiceMessage = (info: { url: string; name: string; type: string; duration: number }) => {
    onSendMessage("", info, replyingTo || undefined);
    if (onCancelReply) {
      onCancelReply();
    }
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  return (
    <div className="p-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      {replyingTo && (
        <div className="mb-2">
          <ReplyPreview replyTo={replyingTo} />
        </div>
      )}
      <div className="flex items-end gap-2">
        <FileUploadButton onFileSelect={handleFileSelect} isLoading={isLoading} />
        <VoiceMessageRecorder onRecordingComplete={handleVoiceMessage} />
        <div className="flex-1">
          <TextArea
            ref={textAreaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (onTyping) {
                onTyping(e.target.value.length > 0);
              }
            }}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            disabled={isLoading}
          />
        </div>
        <Button
          size="icon"
          onClick={handleSend}
          disabled={(!content.trim() && !fileInfo) || isLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};