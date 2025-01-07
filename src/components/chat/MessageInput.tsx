import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, X } from "lucide-react";
import { uploadFile } from "@/utils/fileUpload";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (message: string, fileInfo?: { url: string; name: string; type: string }) => void;
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

      onSendMessage(newMessage, fileInfo);
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <div className="p-4 border-t bg-white sticky bottom-0 w-full">
      {selectedFile && (
        <div className="mb-2 p-2 bg-blue-50 rounded-md flex items-center justify-between">
          <span className="text-sm text-blue-700 truncate">{selectedFile.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedFile(null)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button 
          onClick={handleSend} 
          disabled={isLoading || (!newMessage.trim() && !selectedFile)}
          className="px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};