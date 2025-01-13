import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceMessageRecorder } from './VoiceMessageRecorder';
import { Label } from "@/components/ui/label";
import { Upload, Send, Mic } from "lucide-react";

export interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => void;
  isLoading: boolean;
  onStartCall?: () => void;
}

export const MessageInput = ({ onSendMessage, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      onSendMessage('', { url, name: file.name, type: file.type });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleVoiceMessage = (fileInfo: { url: string; name: string; type: string; duration: number }) => {
    onSendMessage('', fileInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-[#F0F2F5] border-t">
      <Label htmlFor="file" className="cursor-pointer hover:text-gray-600">
        <Upload className="h-5 w-5 text-gray-500" />
        <input
          type="file"
          id="file"
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
      </Label>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={isLoading}
        className="flex-1 rounded-full bg-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {message.trim() ? (
        <Button 
          type="submit" 
          disabled={isLoading} 
          size="icon"
          variant="ghost"
          className="hover:bg-gray-100"
        >
          <Send className="h-5 w-5 text-gray-500" />
        </Button>
      ) : (
        <VoiceMessageRecorder onRecordingComplete={handleVoiceMessage} />
      )}
    </form>
  );
};