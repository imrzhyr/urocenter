import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceMessageRecorder } from './VoiceMessageRecorder';
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => void;
  isLoading: boolean;
  onStartCall?: () => void;
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
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={isLoading}
        className="flex-1"
      />
      <Label htmlFor="file" className="cursor-pointer">
        <Upload className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        <input
          type="file"
          id="file"
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
      </Label>
      <VoiceMessageRecorder onRecordingComplete={handleVoiceMessage} />
      <Button type="submit" disabled={isLoading || !message.trim()}>
        Send
      </Button>
    </form>
  );
};