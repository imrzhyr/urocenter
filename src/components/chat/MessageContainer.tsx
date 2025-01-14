import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { AudioCall } from '../call/AudioCall';
import { Message } from '@/types/profile';
import { callSignaling } from '@/features/call/CallSignaling';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { callState } from '@/features/call/CallState';

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
    <div className="flex flex-col h-screen bg-white dark:bg-[#1A1F2C] max-w-[95%] md:max-w-[60%] mx-auto">
      <div className="fixed top-0 left-0 right-0 z-10 bg-[#0066CC] text-white shadow-sm">
        {header}
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col mt-[48px] mb-[64px]">
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
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <MessageInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>
    </div>
  );
};