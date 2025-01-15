import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '@/types/profile';
import { TypingIndicator } from './TypingIndicator';

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => void;
  onTyping?: (isTyping: boolean) => void;
  isLoading: boolean;
  header: React.ReactNode;
  userId: string;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ 
  messages,
  onSendMessage,
  onTyping,
  isLoading,
  header,
  userId
}) => {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  const typingUsers = messages[messages.length - 1]?.typing_users || [];

  // Prevent pull to refresh and zooming
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Prevent zooming
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      // Reset viewport
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-[#1A1F2C] touch-none">
      <div className="absolute top-0 left-0 right-0 z-50 bg-[#0066CC] text-white touch-none">
        {header}
      </div>
      
      <div className="absolute inset-0 top-[56px] bottom-[64px]">
        <div className="h-full overflow-y-auto chat-background touch-pan-y">
          <MessageList
            messages={messages}
            currentUserId={userId}
            onReply={setReplyingTo}
            replyingTo={replyingTo}
          />
          <TypingIndicator typingUsers={typingUsers} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1A1F2C]/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700/50 touch-none">
        <MessageInput 
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          onTyping={onTyping}
        />
      </div>
    </div>
  );
};