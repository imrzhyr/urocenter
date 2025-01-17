import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextArea } from "./input/TextArea";
import { SendButton } from "./input/SendButton";
import { ReplyPreview } from "./reply/ReplyPreview";
import { Message } from "@/types/profile";
import { FileUploadButton } from "./FileUploadButton";
import { VoiceMessageButton } from "./VoiceMessageButton";

export interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => void;
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
      onTyping?.(false);
    }
  };

  const handleFileUpload = (fileInfo: { url: string; name: string; type: string }) => {
    onSendMessage("", fileInfo, replyingTo || undefined);
    if (onCancelReply) {
      onCancelReply();
    }
  };

  const handleVoiceMessage = (fileInfo: { url: string; name: string; type: string; duration: number }) => {
    onSendMessage("", fileInfo, replyingTo || undefined);
    if (onCancelReply) {
      onCancelReply();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-background border-t">
      {replyingTo && (
        <ReplyPreview
          message={replyingTo}
          onCancelReply={onCancelReply || (() => {})}
        />
      )}
      <div className="relative flex items-center gap-2 p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <FileUploadButton onFileUpload={handleFileUpload} />
          <VoiceMessageButton onVoiceMessage={handleVoiceMessage} />
        </div>
        <TextArea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            onTyping?.(e.target.value.length > 0);
          }}
          placeholder={t("type_message")}
          rows={1}
          className="flex-1"
        />
        <SendButton isLoading={isLoading} />
      </div>
    </form>
  );
};