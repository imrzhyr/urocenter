import React from 'react';
import { MessageList } from './components/messages';
import { MessageInput } from './components/input';
import { TypingIndicator } from './components/status';
import { DoctorChatHeader } from './doctor/DoctorChatHeader';
import { PatientChatHeader } from './patient/PatientChatHeader';
import type { Message, FileInfo } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

interface MessageContainerProps {
  messages?: Message[];
  onSendMessage: (content: string, fileInfo?: FileInfo) => Promise<void>;
  isLoading?: boolean;
  header: React.ReactNode;
  otherPersonIsTyping?: boolean;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
  messages = [],
  onSendMessage,
  isLoading = false,
  header,
  otherPersonIsTyping = false,
}) => {
  const [isTyping, setIsTyping] = React.useState(false);
  const { t } = useLanguage();
  const { profile } = useProfile();
  const messageListRef = React.useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);

  const forceScrollToBottom = React.useCallback((smooth = false) => {
    if (!messageListRef.current) return;
    
    const element = messageListRef.current;
    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      });
    };

    // Initial scroll
    scrollToBottom();

    // Additional scrolls to handle dynamic content
    if (!smooth) {
      setTimeout(scrollToBottom, 100);
      setTimeout(scrollToBottom, 300);
    }
  }, []);

  // Handle scroll events with more precise bottom detection
  const handleScroll = React.useCallback(() => {
    if (!messageListRef.current || isSending) return;
    
    const element = messageListRef.current;
    const isAtBottom = Math.abs(
      (element.scrollHeight - element.scrollTop - element.clientHeight)
    ) <= 20; // Slightly more forgiving threshold
    setShouldAutoScroll(isAtBottom);
  }, [isSending]);

  // Initial load scroll - use smooth scrolling
  React.useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Wait for the next frame to ensure content is rendered
      requestAnimationFrame(() => {
        if (messageListRef.current) {
          messageListRef.current.scrollTo({
            top: messageListRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [isLoading, messages.length]);

  // Auto-scroll on new messages if we're at the bottom
  React.useEffect(() => {
    if ((shouldAutoScroll || isSending) && !isLoading && messages.length > 0) {
      requestAnimationFrame(() => {
        if (messageListRef.current) {
          messageListRef.current.scrollTo({
            top: messageListRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [messages, shouldAutoScroll, isSending, isLoading]);

  // Add scroll event listener
  React.useEffect(() => {
    const element = messageListRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleReply = React.useCallback((message: Message) => {
    // TODO: Implement reply
    console.log('Replying to:', message);
  }, []);

  const handleMessageSeen = React.useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ seen: true })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as seen:', error);
    }
  }, []);

  // Handle message sending with smooth auto-scroll
  const handleSendMessage = async (content: string, fileInfo?: FileInfo) => {
    try {
      setIsSending(true);
      await onSendMessage(content, fileInfo);
      forceScrollToBottom(true);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setTimeout(() => setIsSending(false), 500);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col h-screen",
      "bg-[#F2F2F7] dark:bg-[#1C1C1E]"
    )}>
      {header}
      <div 
        ref={messageListRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        {!messages || messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[#8E8E93] dark:text-[#98989D]">
            {t('no_messages_yet')}
          </div>
        ) : (
          <MessageList 
            messages={messages}
            currentUserId={profile?.id}
            onMessageSeen={handleMessageSeen}
            onReply={handleReply}
          />
        )}
      </div>
      {/* Only show typing indicator if there are messages and the other person is typing */}
      {otherPersonIsTyping && messages?.length > 0 && <TypingIndicator />}
      <div className="sticky bottom-0 bg-[#F2F2F7] dark:bg-[#1C1C1E] p-4">
        <MessageInput 
          onSendMessage={handleSendMessage}
          onTyping={setIsTyping}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}; 