import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput = ({ 
  message, 
  onChange, 
  onSend, 
  isLoading, 
  onKeyPress 
}: ChatInputProps) => {
  return (
    <div className="p-4 bg-white border-t border-purple-100">
      <div className="flex space-x-2 max-w-4xl mx-auto">
        <Input
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type your message..."
          className="flex-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
          disabled={isLoading}
        />
        <Button 
          size="icon"
          onClick={onSend}
          disabled={isLoading || !message.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};