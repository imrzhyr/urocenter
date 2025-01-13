import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { AudioCall } from '../call/AudioCall';
import { Message } from '@/types/profile';
import { callSignaling } from '@/features/call/CallSignaling';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { callState } from '@/features/call/CallState';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
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

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-10 bg-primary text-white shadow-sm">
        <div className="flex items-center gap-3 py-2 px-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-primary/20"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Button>
          <div className="flex-1">{header}</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col mt-[56px] mb-[64px]">
        {isCallActive ? (
          <AudioCall recipientId={userId} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <MessageList
                messages={messages}
                currentUserId={profile?.id || ''}
              />
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <MessageInput 
          onSendMessage={onSendMessage} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};