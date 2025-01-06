import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";
import { useState, useRef } from "react";

interface ChatInputProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onFileSelect: (file: File) => void;
}

export const ChatInput = ({ 
  message, 
  onChange, 
  onSend, 
  isLoading, 
  onKeyPress,
  onFileSelect
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-blue-100">
      <div className="flex space-x-2 max-w-4xl mx-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        <Button 
          size="icon"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="border-blue-200 hover:bg-blue-50"
        >
          <Paperclip className="w-5 h-5 text-blue-600" />
        </Button>
        <Input
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={selectedFile ? `Selected file: ${selectedFile.name}` : "Type your message..."}
          className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          disabled={isLoading}
        />
        <Button 
          size="icon"
          onClick={onSend}
          disabled={isLoading || (!message.trim() && !selectedFile)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};