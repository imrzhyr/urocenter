import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Plus } from "lucide-react";
import { uploadFile } from "@/utils/fileUpload";
import { toast } from "sonner";
import { VoiceMessageRecorder } from "./VoiceMessageRecorder";

interface MessageInputProps {
  onSendMessage: (message: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => void;
  isLoading: boolean;
}

export const MessageInput = ({ onSendMessage, isLoading }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    try {
      let fileInfo;
      if (selectedFile) {
        const uploadedFile = await uploadFile(selectedFile);
        fileInfo = {
          url: uploadedFile.url,
          name: uploadedFile.name,
          type: uploadedFile.type
        };
      }

      await onSendMessage(newMessage, fileInfo);
      setNewMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleVoiceMessage = async (fileInfo: { url: string; name: string; type: string; duration: number }) => {
    try {
      await onSendMessage("", { ...fileInfo });
    } catch (error) {
      console.error("Error sending voice message:", error);
      toast.error("Failed to send voice message");
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-t">
      {selectedFile && (
        <div className="mb-2 p-2 bg-white rounded-md flex items-center justify-between animate-fade-up shadow-sm">
          <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedFile(null)}
            className="h-6 w-6 hover:bg-gray-100"
          >
            <span className="sr-only">Remove file</span>
            <Plus className="h-4 w-4 rotate-45" />
          </Button>
        </div>
      )}
      <div className="flex gap-2 items-end">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-10 w-10 rounded-full hover:bg-gray-200"
        >
          <Plus className="h-5 w-5 text-primary" />
        </Button>
        <VoiceMessageRecorder onRecordingComplete={handleVoiceMessage} />
        <div className="flex-1 bg-white rounded-full shadow-sm">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message here..."
            className="min-h-[45px] max-h-[120px] resize-none border-0 focus-visible:ring-0 rounded-full px-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>
        <Button 
          onClick={handleSend} 
          disabled={isLoading || (!newMessage.trim() && !selectedFile)}
          className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};