import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '@/types/profile';
import { motion } from 'framer-motion';
import { TypingIndicator } from './TypingIndicator';
import { CallHistory } from './call/CallHistory';

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-[100dvh] bg-white dark:bg-[#1A1F2C] relative"
    >
      <div className="absolute top-0 left-0 right-0 z-10 bg-[#0066CC] text-white backdrop-blur-lg bg-opacity-90">
        {header}
      </div>
      
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex-1 overflow-hidden flex flex-col pt-[48px] pb-[64px]"
      >
        <CallHistory userId={userId} />
        <div className="flex-1 overflow-y-auto h-full">
          <MessageList
            messages={messages}
            currentUserId={userId}
            onReply={setReplyingTo}
            replyingTo={replyingTo}
          />
          <TypingIndicator typingUsers={typingUsers} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1A1F2C]/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700/50"
      >
        <MessageInput 
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          onTyping={onTyping}
        />
      </motion.div>
    </motion.div>
  );
};