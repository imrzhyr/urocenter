import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

export interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onStartCall: () => Promise<void>;
}

export const MessageInput = ({ onSendMessage, isLoading, onStartCall }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
      <Button 
        type="button" 
        variant="ghost" 
        size="icon"
        onClick={onStartCall}
        className="flex-shrink-0"
      >
        <Phone className="h-5 w-5" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading || !message.trim()}>
        Send
      </Button>
    </form>
  );
};