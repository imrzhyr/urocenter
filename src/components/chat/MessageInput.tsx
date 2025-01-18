import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Message } from "@/types/profile";
import { ReplyPreview } from "./reply/ReplyPreview";
import { TextArea } from "./input/TextArea";

interface MessageInputProps {
  onSendMessage: (content: string, replyTo?: Message) => void;
  isLoading?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  onTyping?: (isTyping: boolean) => void;
}

export const MessageInput = ({
  onSendMessage,
  isLoading,
  replyingTo,
  onCancelReply,
  onTyping
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim(), replyingTo || undefined);
      setMessage("");
      if (onCancelReply) {
        onCancelReply();
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-background border-t">
      {replyingTo && (
        <ReplyPreview
          message={replyingTo}
          onCancel={onCancelReply || (() => {})}
        />
      )}
      <div className="relative flex items-center gap-2 p-4 max-w-7xl mx-auto">
        <TextArea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (onTyping) {
              onTyping(e.target.value.length > 0);
            }
          }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim() || isLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};