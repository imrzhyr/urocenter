import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { VideoCall } from '../call/VideoCall';
import { Message } from '@/types/profile';
import { callSignaling } from '@/features/call/CallSignaling';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
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
  const { profile } = useProfile();
  
  const startCall = async () => {
    if (!profile?.id) return;
    
    setIsCallActive(true);
    callSignaling.initialize(userId);
    await callSignaling.sendCallRequest(userId, profile.id);
    toast.info('Calling...');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-10 bg-primary text-white shadow-md">
        {header}
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col mt-[72px] mb-[80px]">
        {isCallActive ? (
          <VideoCall recipientId={userId} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <MessageList
                messages={messages}
                isLoading={isLoading}
                userId={userId}
              />
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white shadow-lg">
        <MessageInput 
          onSendMessage={onSendMessage} 
          isLoading={isLoading}
          onStartCall={startCall}
        />
      </div>
    </div>
  );
};