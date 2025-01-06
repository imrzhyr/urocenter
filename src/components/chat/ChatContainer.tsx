import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useMessages } from "@/hooks/useMessages";
import { uploadFile } from "@/utils/fileUpload";
import { supabase } from "@/integrations/supabase/client";

interface ChatContainerProps {
  patientId?: string;
}

export const ChatContainer = ({ patientId }: ChatContainerProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  useAuthRedirect();
  const { messages, addMessage } = useMessages(patientId);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (retryCount = 0) => {
    if (!message.trim() && !selectedFile) return;
    
    setIsLoading(true);
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error('Please sign in to send messages');
        return;
      }

      // Set user context
      const { error: contextError } = await supabase.rpc('set_user_context', { 
        user_phone: userPhone 
      });

      if (contextError) {
        console.error('Error setting user context:', contextError);
        if (retryCount < 3) {
          // Clear any existing retry timeout
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          // Retry after a delay
          retryTimeoutRef.current = setTimeout(() => {
            handleSendMessage(retryCount + 1);
          }, 1000 * (retryCount + 1));
          return;
        }
        throw contextError;
      }

      let fileData;
      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      const success = await addMessage(message.trim(), fileData);
      
      if (success) {
        setMessage('');
        setSelectedFile(null);
      } else {
        if (retryCount < 3) {
          // Clear any existing retry timeout
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          // Retry after a delay
          retryTimeoutRef.current = setTimeout(() => {
            handleSendMessage(retryCount + 1);
          }, 1000 * (retryCount + 1));
          return;
        }
        toast.error('Failed to send message after multiple attempts');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup retry timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  if (!messages) {
    return <div className="flex-1 flex items-center justify-center">Loading messages...</div>;
  }

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
        onSend={() => handleSendMessage()}
        isLoading={isLoading}
        onKeyPress={handleKeyPress}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};