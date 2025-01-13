import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextArea } from "./input/TextArea";
import { AttachmentButton } from "./input/AttachmentButton";
import { SendButton } from "./input/SendButton";
import { ReplyPreview } from "./reply/ReplyPreview";

interface MessageInputProps {
  onSend: (content: string) => void;
  onAttachment: () => void;
  isLoading?: boolean;
  replyTo?: any;
  onCancelReply?: () => void;
}

export const MessageInput = ({
  onSend,
  onAttachment,
  isLoading,
  replyTo,
  onCancelReply
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-background">
      {replyTo && (
        <ReplyPreview
          replyTo={replyTo}
          onCancel={onCancelReply}
        />
      )}
      <div className="relative flex items-center gap-2">
        <AttachmentButton onClick={onAttachment} isLoading={isLoading} />
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