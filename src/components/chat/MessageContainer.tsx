import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '@/types/profile';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';

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
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <div className="absolute top-0 left-0 right-0 z-50 bg-primary text-primary-foreground">
        {header}
      </div>
      
      <div className="absolute inset-0 top-[56px] bottom-[64px]">
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.is_from_doctor ? "received" : "sent"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                fallback={message.is_from_doctor ? "DR" : "ME"}
              />
              <ChatBubbleMessage
                variant={message.is_from_doctor ? "received" : "sent"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                fallback="DR"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
          <TypingIndicator typingUsers={messages[messages.length - 1]?.typing_users || []} />
        </ChatMessageList>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-background border-t">
        <MessageInput 
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          onTyping={onTyping}
        />
      </div>
    </div>
  );
};