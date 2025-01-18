import { ImageUploadButton } from "../media/ImageUploadButton";
import { VoiceMessageButton } from "../media/VoiceMessageButton";

interface ChatInputToolsProps {
  onFileUpload: (fileInfo: { url: string; name: string; type: string }) => void;
  onVoiceMessage: (fileInfo: { url: string; name: string; type: string; duration: number }) => void;
  disabled?: boolean;
}

export const ChatInputTools = ({ onFileUpload, onVoiceMessage, disabled }: ChatInputToolsProps) => {
  return (
    <div className="flex items-center gap-2">
      <ImageUploadButton onImageUpload={onFileUpload} disabled={disabled} />
      <VoiceMessageButton onRecordingComplete={onVoiceMessage} />
    </div>
  );
};