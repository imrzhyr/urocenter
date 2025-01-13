import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextArea } from "./input/TextArea";
import { AttachmentButton } from "./input/AttachmentButton";
import { SendButton } from "./input/SendButton";
import { ReplyPreview } from "./reply/ReplyPreview";
import { Message } from "@/types/profile";

export interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => void;
  isLoading?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

export const MessageInput = ({
  onSendMessage,
  isLoading,
  replyingTo,
  onCancelReply
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim(), undefined, replyingTo || undefined);
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
    <form onSubmit={handleSubmit} className="p-4 bg-background">
      {replyingTo && (
        <ReplyPreview
          message={replyingTo}
          onCancelReply={onCancelReply || (() => {})}
        />
      )}
      <div className="relative flex items-center gap-2">
        <AttachmentButton onClick={() => {}} isLoading={isLoading} />
        <TextArea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("type_message")}
          rows={1}
        />
        <SendButton isLoading={isLoading} />
      </div>
    </form>
  );
};