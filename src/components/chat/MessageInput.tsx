import { useState, useRef } from "react";
import { SendButton } from "./input/SendButton";
import { TextArea } from "./input/TextArea";
import { AttachmentButton } from "./input/AttachmentButton";
import { Message } from "@/types/profile";
import { ReplyPreview } from "./reply/ReplyPreview";
import { VoiceRecorder } from "./voice/VoiceRecorder";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/utils/fileUpload";
import { toast } from "sonner";

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
  const [isRecording, setIsRecording] = useState(false);
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

  const handleVoiceMessage = async (audioBlob: Blob, duration: number) => {
    try {
      const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, {
        type: 'audio/webm'
      });

      const fileInfo = await uploadFile(file);
      onSendMessage("", { ...fileInfo, duration }, replyingTo || undefined);
      setIsRecording(false);
    } catch (error) {
      console.error('Error uploading voice message:', error);
      toast.error('Failed to send voice message');
    }
  };

  return (
    <div className="p-4 space-y-4">
      {replyingTo && (
        <ReplyPreview message={replyingTo} onCancelReply={onCancelReply} />
      )}
      
      {isRecording ? (
        <VoiceRecorder
          onSendVoice={handleVoiceMessage}
          onCancel={() => setIsRecording(false)}
        />
      ) : (
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
          
          {message.trim() ? (
            <SendButton
              onClick={handleSend}
              isLoading={isLoading}
              disabled={isLoading || !message.trim()}
            />
          ) : (
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsRecording(true)}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};