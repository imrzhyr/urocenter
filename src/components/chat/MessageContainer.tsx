import React, { useState } from 'react';
import { Message } from '@/types/profile';
import { TypingIndicator } from './TypingIndicator';
import { Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { useProfile } from '@/hooks/useProfile';

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => void;
  onTyping?: (isTyping: boolean) => void;
  isLoading: boolean;
  header: React.ReactNode;
  userId: string;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ 
  messages = [],
  onSendMessage,
  onTyping,
  isLoading,
  header,
  userId
}) => {
  const [message, setMessage] = useState("");
  const { profile } = useProfile();
  
  const typingUsers = messages && messages.length > 0 ? 
    messages[messages.length - 1]?.typing_users || [] : 
    [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      onTyping?.(false);
    }
  };

  const handleAttachFile = () => {
    // File attachment logic
  };

  const handleMicrophoneClick = () => {
    // Voice message logic
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f0f7ff] dark:bg-[#1A2433] w-full max-w-full overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-50 bg-[#0066CC] text-white w-full">
        {header}
      </div>
      
      <div className="absolute inset-0 top-[56px] bottom-[64px] w-full">
        <ChatMessageList>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              variant={msg.is_from_doctor === (profile?.role === 'admin') ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                fallback={msg.is_from_doctor ? "D" : "P"}
              />
              <ChatBubbleMessage
                variant={msg.is_from_doctor === (profile?.role === 'admin') ? "sent" : "received"}
              >
                {msg.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          <TypingIndicator typingUsers={typingUsers} />
        </ChatMessageList>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1A2433]/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700/50 w-full p-4">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              onTyping?.(e.target.value.length > 0);
            }}
            placeholder="Type your message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleAttachFile}
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleMicrophoneClick}
              >
                <Mic className="size-4" />
              </Button>
            </div>
            <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={!message.trim()}>
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};