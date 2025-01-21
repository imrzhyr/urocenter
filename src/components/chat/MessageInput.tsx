import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Image } from "lucide-react";
import { TextArea } from "./input/TextArea";
import { toast } from "sonner";
import { VoiceMessageRecorder } from "./VoiceMessageRecorder";
import { uploadFile, uploadFiles } from "@/utils/fileUpload";
import { Progress } from "@/components/ui/progress";

interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: { 
    url: string; 
    name: string; 
    type: string; 
    duration?: number;
    urls?: string[];
    names?: string[];
    types?: string[];
  }) => void;
  isLoading?: boolean;
}

export const MessageInput = ({
  onSendMessage,
  isLoading
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // If only one file, use the old method
      if (files.length === 1) {
        const fileInfo = await uploadFile(files[0], () => setUploadProgress(0.5));
        setUploadProgress(1);
        onSendMessage("", fileInfo);
      } else {
        // For multiple files, use the new uploadFiles function
        const uploadedFiles = await uploadFiles(files, (progress) => {
          setUploadProgress(progress);
        });
        
        // Group the file information
        const fileInfo = {
          // Use the first file's info as the main file info
          url: uploadedFiles[0].url,
          name: uploadedFiles[0].name,
          type: uploadedFiles[0].type,
          // Add arrays for multiple files
          urls: uploadedFiles.map(f => f.url),
          names: uploadedFiles.map(f => f.name),
          types: uploadedFiles.map(f => f.type)
        };
        
        onSendMessage("", fileInfo);
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*"
        multiple
      />
      {isUploading && (
        <div className="px-4 py-2">
          <Progress value={uploadProgress * 100} className="h-1" />
        </div>
      )}
      <div className="relative flex items-center gap-2 p-2 max-w-7xl mx-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isUploading}
        >
          <Image className="h-4 w-4" />
        </Button>
        <VoiceMessageRecorder onRecordingComplete={(fileInfo) => onSendMessage("", fileInfo)} />
        <TextArea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          rows={1}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          className="h-8 w-8"
          disabled={!message.trim() || isLoading || isUploading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};