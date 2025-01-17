import { useState, useRef } from "react";
import { SendButton } from "../SendButton/SendButton";
import { TextArea } from "../TextArea/TextArea";
import { AttachmentButton } from "../AttachmentButton/AttachmentButton";
import { Message } from "@/types/profile";
import { ReplyPreview } from "../ReplyPreview/ReplyPreview";

interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => void;
  isLoading?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  onTyping?: (isTyping: boolean) => void;
  userId: string;
}

export const MessageInput = ({
  onSendMessage,
  isLoading,
  replyingTo,
  onCancelReply,
  onTyping,
  userId
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, undefined, replyingTo || undefined);
      setMessage("");
      onCancelReply?.();
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (onTyping) {
      onTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }
  };

  const handleFileSelect = (fileInfo: { url: string; name: string; type: string }) => {
    onSendMessage("", fileInfo, replyingTo || undefined);
    onCancelReply?.();
  };

  return (
    <div className="p-4 space-y-4">
      {replyingTo && (
        <ReplyPreview message={replyingTo} onCancelReply={onCancelReply} />
      )}
      
      <div className="flex items-end gap-2">
        <AttachmentButton
          onClick={() => {}}
          onFileSelect={handleFileSelect}
          isLoading={isLoading}
        />
        
        <TextArea
          ref={textAreaRef}
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1"
          placeholder="Type a message..."
        />
        
        <SendButton
          onClick={handleSend}
          isLoading={isLoading}
          disabled={isLoading || !message.trim()}
        />
      </div>
    </div>
  );
};