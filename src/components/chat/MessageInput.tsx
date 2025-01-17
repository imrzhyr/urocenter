import { useState, useRef, useEffect } from "react";
import { SendButton } from "./input/SendButton";
import { TextArea } from "./input/TextArea";
import { AttachmentButton } from "./input/AttachmentButton";
import { VoiceMessageRecorder } from "@/features/chat/components/VoiceMessageRecorder/VoiceMessageRecorder";
import { Message } from "@/types/profile";
import { ReplyPreview } from "./reply/ReplyPreview";

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

  useEffect(() => {
    if (replyingTo && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [replyingTo]);

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

  return (
    <div className="p-4 space-y-4">
      {replyingTo && (
        <ReplyPreview message={replyingTo} onCancel={onCancelReply} />
      )}
      
      <div className="flex items-end gap-2">
        <AttachmentButton
          onFileSelect={(fileInfo) => {
            onSendMessage("", fileInfo, replyingTo || undefined);
            onCancelReply?.();
          }}
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

        <VoiceMessageRecorder 
          userId={userId}
          onRecordingComplete={() => {
            onCancelReply?.();
          }}
        />
        
        <SendButton
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
        />
      </div>
    </div>
  );
};