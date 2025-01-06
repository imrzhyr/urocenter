import { useState } from "react";
import { toast } from "sonner";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useMessages } from "@/hooks/useMessages";
import { sendMessage } from "@/utils/messageSender";

export const ChatContainer = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useAuthRedirect();
  const { messages } = useMessages();

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    
    setIsLoading(true);
    try {
      await sendMessage(message, selectedFile, () => {
        setMessage('');
        setSelectedFile(null);
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id || index}
            content={msg.content}
            isFromDoctor={msg.is_from_doctor}
            fileUrl={msg.file_url}
            fileName={msg.file_name}
            fileType={msg.file_type}
          />
        ))}
      </div>

      <ChatInput
        message={message}
        onChange={setMessage}
        onSend={handleSendMessage}
        isLoading={isLoading}
        onKeyPress={handleKeyPress}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};