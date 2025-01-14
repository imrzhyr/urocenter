import React, { useState } from 'react';
import { MessageList } from '../MessageList/MessageList';
import { MessageInput } from '../MessageInput/MessageInput';
import { AudioCall } from '@/components/call/AudioCall';
import { Message } from '@/types/profile';
import { callSignaling } from '@/features/call/CallSignaling';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { callState } from '@/features/call/CallState';
import { motion } from 'framer-motion';

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => void;
  isLoading: boolean;
  header: React.ReactNode;
  userId: string;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ 
  messages,
  onSendMessage,
  isLoading,
  header,
  userId
}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const { profile } = useProfile();
  
  const startCall = async () => {
    if (!profile?.id) {
      toast.error("Cannot start call - profile not found");
      return;
    }
    
    try {
      setIsCallActive(true);
      callState.setStatus('ringing', userId);
      callSignaling.initialize(userId);
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
      setIsCallActive(false);
      callState.setStatus('idle');
    }
  };

  const handleSendMessage = (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => {
    onSendMessage(content, fileInfo, replyTo);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-screen bg-white dark:bg-[#1A1F2C]"
    >
      <div className="fixed top-0 left-0 right-0 z-10 bg-[#0066CC] text-white backdrop-blur-lg bg-opacity-90">
        {header}
      </div>
      
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex-1 overflow-hidden flex flex-col mt-[48px] mb-[64px]"
      >
        {isCallActive ? (
          <AudioCall recipientId={userId} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <MessageList
                messages={messages}
                currentUserId={profile?.id || ''}
                onReply={setReplyingTo}
                replyingTo={replyingTo}
              />
            </div>
          </>
        )}
      </motion.div>

      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1A1F2C]/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700/50"
      >
        <MessageInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </motion.div>
    </motion.div>
  );
};