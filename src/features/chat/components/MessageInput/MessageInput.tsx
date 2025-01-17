import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextArea } from "../TextArea/TextArea";
import { AttachmentButton } from "../AttachmentButton/AttachmentButton";
import { SendButton } from "../SendButton/SendButton";
import { ReplyPreview } from "../ReplyPreview/ReplyPreview";
import { Message } from "@/types/profile";
import { VoiceMessageRecorder } from "../VoiceMessageRecorder/VoiceMessageRecorder";
import { uploadFile } from "@/utils/fileUpload";
import { toast } from "sonner";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileInfo = await uploadFile(file);
      onSendMessage("", fileInfo, replyingTo || undefined);
      if (onCancelReply) {
        onCancelReply();
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />
      {replyingTo && (
        <ReplyPreview
          message={replyingTo}
          onCancelReply={onCancelReply || (() => {})}
        />
      )}
      <div className="relative flex items-center gap-2 p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <AttachmentButton 
            onClick={() => fileInputRef.current?.click()} 
            isLoading={isLoading} 
          />
          <VoiceMessageRecorder onRecordingComplete={(fileInfo) => onSendMessage("", fileInfo)} />
        </div>
        <TextArea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("type_message")}
          rows={1}
          className="flex-1"
        />
        <SendButton isLoading={isLoading} />
      </div>
    </form>
  );
};