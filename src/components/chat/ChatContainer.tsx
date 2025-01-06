import { useState, useRef } from "react";
import { toast } from "sonner";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { uploadFile } from "@/utils/fileUpload";

interface ChatContainerProps {
  patientId?: string;
}

export const ChatContainer = ({ patientId }: ChatContainerProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Temporary mock messages for UI demonstration
  const messages = [
    {
      id: '1',
      content: 'Hello, how can I help you today?',
      is_from_doctor: true,
      status: 'not_seen',
      file_url: undefined,
      file_name: undefined,
      file_type: undefined
    }
  ];

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    
    setIsLoading(true);
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error('Please sign in to send messages');
        return;
      }

      let fileData;
      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      // Placeholder for message sending logic
      console.log('Message to send:', message, fileData);
      setMessage('');
      setSelectedFile(null);
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
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
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            id={msg.id}
            content={msg.content}
            isFromDoctor={msg.is_from_doctor}
            fileUrl={msg.file_url}
            fileName={msg.file_name}
            fileType={msg.file_type}
            status={msg.status}
            userId={patientId || ''}
          />
        ))}
        <div ref={messagesEndRef} />
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