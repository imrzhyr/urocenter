import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { VideoCall } from '../call/VideoCall';

interface MessageContainerProps {
  messages: Array<{ id: string; content: string; senderId: string }>;
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
  
  const startCall = () => {
    setIsCallActive(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {header}
      
      {isCallActive ? (
        <VideoCall recipientId={userId} />
      ) : (
        <>
          <MessageList
            messages={messages}
            isLoading={isLoading}
            userId={userId}
          />
          <MessageInput onSendMessage={onSendMessage} />
        </>
      )}
    </div>
  );
};
