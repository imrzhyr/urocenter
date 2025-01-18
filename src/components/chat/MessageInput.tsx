import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextArea } from "./input/TextArea";
import { SendButton } from "./input/SendButton";
import { ReplyPreview } from "./reply/ReplyPreview";
import { Message } from "@/types/profile";
import { FileUploadButton } from "./media/FileUploadButton";
import { VoiceMessageButton } from "./media/VoiceMessageButton";
import { uploadFile } from "@/utils/fileUpload";

interface MessageInputProps {
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Selected file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      const fileInfo = await uploadFile(file);
      onSendMessage("", fileInfo, replyingTo || undefined);
      if (onCancelReply) {
        onCancelReply();
      }
    } catch (error) {
      console.error('File upload error:', error);
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
          <FileUploadButton onFileUpload={handleFileSelect} />
          <VoiceMessageButton onVoiceMessage={(fileInfo) => onSendMessage("", fileInfo)} />
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