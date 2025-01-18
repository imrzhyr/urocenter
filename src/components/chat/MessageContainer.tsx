import React, { useState } from 'react';
import { Message } from '@/types/profile';
import { TypingIndicator } from './TypingIndicator';
import { Mic, Image, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatBubble, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { useProfile } from '@/hooks/useProfile';
import { format } from 'date-fns';
import { MediaGallery } from './media/MediaGallery';
import { AudioPlayer } from './audio/AudioPlayer';
import { uploadFile } from '@/utils/fileUpload';
import { toast } from 'sonner';

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
  const { profile } = useProfile();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const typingUsers = messages && messages.length > 0 ? 
    messages[messages.length - 1]?.typing_users || [] : 
    [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileInfo = await uploadFile(file);
      onSendMessage("", fileInfo);
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
          className="max-w-[180px]"
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
      
      <div className="absolute inset-0 top-[56px] bottom-[52px] w-full">
        <ChatMessageList>
          {messages.map((msg) => {
            const fromCurrentUser = msg.is_from_doctor === (profile?.role === 'admin');
            const messageTime = msg.created_at ? format(new Date(msg.created_at), 'h:mm a') : '';
            
            return (
              <ChatBubble
                key={msg.id}
                variant={fromCurrentUser ? "sent" : "received"}
              >
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

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-[#1F2937] dark:bg-[#1F2937] w-full py-2 px-4">
        <form className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Mic className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};