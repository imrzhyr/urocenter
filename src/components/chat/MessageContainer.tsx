import React, { useState } from 'react';
import { Message } from '@/types/profile';
import { TypingIndicator } from './TypingIndicator';
import { Paperclip, Mic, CornerDownLeft, Phone, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { useProfile } from '@/hooks/useProfile';
import { format } from 'date-fns';
import { MediaGallery } from './media/MediaGallery';
import { AudioPlayer } from './audio/AudioPlayer';

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

  const renderCallMessage = (msg: Message) => {
    const duration = msg.duration ? `${Math.floor(msg.duration / 60)}:${(msg.duration % 60).toString().padStart(2, '0')}` : '';
    return (
      <div className="flex items-center gap-2 text-sm">
        <Phone className="h-4 w-4" />
        <span>Voice call</span>
        {duration && <span className="text-xs opacity-70">{duration}</span>}
      </div>
    );
  };

  const renderMessageContent = (msg: Message, fromCurrentUser: boolean) => {
    if (msg.type === 'call') {
      return renderCallMessage(msg);
    }

    if (msg.file_type?.startsWith('audio/')) {
      return (
        <AudioPlayer
          url={msg.file_url || ''}
          messageId={msg.id}
          duration={msg.duration}
          className="max-w-[200px]"
        />
      );
    }

    if (msg.file_url && (msg.file_type?.startsWith('image/') || msg.file_type?.startsWith('video/'))) {
      return (
        <MediaGallery
          fileUrl={msg.file_url}
          fileType={msg.file_type}
          fileName={msg.file_name}
          className="mb-2"
          messageId={msg.id}
        />
      );
    }

    return msg.content;
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#111111] dark:bg-[#111111] w-full max-w-full overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-50 bg-[#1F2937] dark:bg-[#1F2937] text-white w-full">
        {header}
      </div>
      
      <div className="absolute inset-0 top-[56px] bottom-[64px] w-full">
        <ChatMessageList>
          {messages.map((msg) => {
            const fromCurrentUser = msg.is_from_doctor === (profile?.role === 'admin');
            const messageTime = msg.created_at ? format(new Date(msg.created_at), 'h:mm a') : '';
            
            return (
              <ChatBubble
                key={msg.id}
                variant={fromCurrentUser ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  fallback={msg.is_from_doctor ? "D" : "P"}
                />
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <ChatBubbleMessage
                    variant={fromCurrentUser ? "sent" : "received"}
                    className={`${fromCurrentUser ? 'bg-[#015C4B]' : 'bg-[#1F2937]'} text-white text-[14px] leading-[20px]`}
                  >
                    {renderMessageContent(msg, fromCurrentUser)}
                    <span className="text-[10px] opacity-70 float-right mt-1 ml-2">
                      {messageTime}
                    </span>
                  </ChatBubbleMessage>
                </div>
              </ChatBubble>
            );
          })}
          <TypingIndicator typingUsers={typingUsers} />
        </ChatMessageList>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-[#1F2937] dark:bg-[#1F2937] w-full p-4">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg bg-[#2D3748] focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              onTyping?.(e.target.value.length > 0);
            }}
            placeholder="Type a message"
            className="min-h-12 resize-none rounded-lg bg-[#2D3748] text-white border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="text-gray-400 hover:text-white"
              >
                <Paperclip className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="text-gray-400 hover:text-white"
              >
                <Image className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="text-gray-400 hover:text-white"
              >
                <Mic className="size-5" />
              </Button>
            </div>
            <Button 
              type="submit" 
              size="sm" 
              className="ml-auto gap-1.5 bg-[#015C4B] hover:bg-[#015C4B]/90"
              disabled={!message.trim()}
            >
              Send
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};