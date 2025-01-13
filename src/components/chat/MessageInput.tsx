import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceMessageRecorder } from './VoiceMessageRecorder';
import { Label } from "@/components/ui/label";
import { Upload, Send, Mic, X } from "lucide-react";
import { Message } from '@/types/profile';

export interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => void;
  isLoading: boolean;
  onStartCall?: () => void;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

export const MessageInput = ({ onSendMessage, isLoading, replyingTo, onCancelReply }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim(), undefined, replyingTo || undefined);
      setMessage('');
      onCancelReply?.();
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
      onSendMessage('', { url, name: file.name, type: file.type }, replyingTo || undefined);
      onCancelReply?.();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleVoiceMessage = (fileInfo: { url: string; name: string; type: string; duration: number }) => {
    onSendMessage('', fileInfo, replyingTo || undefined);
    onCancelReply?.();
  };

  const getReplyPreview = (message: Message) => {
    if (message.file_type?.startsWith('audio/')) return '🎵 Voice message';
    if (message.file_type?.startsWith('image/')) return '📷 Photo';
    if (message.file_type?.startsWith('video/')) return '🎥 Video';
    return message.content;
  };

  return (
    <div className="bg-[#F0F2F5] border-t">
      {replyingTo && (
        <div className="px-4 py-2 bg-[#E5DEFF] dark:bg-[#2A2A2A] border-b border-[#D6BCFA] dark:border-[#3A3A3A] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Replying to</p>
              <p className="text-sm truncate max-w-[200px]">{getReplyPreview(replyingTo)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelReply}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
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
    </div>
  );
};