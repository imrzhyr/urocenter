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
  messages = [],
  onSendMessage,
  onTyping,
  isLoading,
  header,
  userId
}) => {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  const typingUsers = messages && messages.length > 0 ? 
    messages[messages.length - 1]?.typing_users || [] : 
    [];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f0f7ff] dark:bg-[#1A2433]">
      <div className="absolute top-0 left-0 right-0 z-50 bg-[#0066CC] text-white">
        {header}
      </div>
      
      <div className="absolute inset-0 top-[56px] bottom-[64px] chat-background">
        <div className="h-full overflow-y-auto">
          <MessageList
            messages={messages}
            currentUserId={userId}
            onReply={setReplyingTo}
            replyingTo={replyingTo}
          />
          <TypingIndicator typingUsers={typingUsers} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1A2433]/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700/50">
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