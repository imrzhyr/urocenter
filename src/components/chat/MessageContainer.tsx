import React from 'react';
import { MessageList } from './components/messages';
import { MessageInput } from './components/input';
import { TypingIndicator } from './components/status';
import { DoctorChatHeader } from './components/header/DoctorChatHeader';
import { PatientChatHeader } from './components/header/PatientChatHeader';
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
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
      <div className="flex-1 overflow-y-auto flex flex-col justify-end">
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
        <div ref={messagesEndRef} />
      </div>
      {/* Only show typing indicator if there are messages and the other person is typing */}
      {otherPersonIsTyping && messages?.length > 0 && <TypingIndicator />}
      <div className="sticky bottom-0 bg-[#F2F2F7] dark:bg-[#1C1C1E] p-4">
        <MessageInput 
          onSendMessage={onSendMessage}
          onTyping={setIsTyping}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}; 