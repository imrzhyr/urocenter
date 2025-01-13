import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceMessageRecorder } from './VoiceMessageRecorder';
import { Label } from "@/components/ui/label";
import { Upload, Send, X } from "lucide-react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim(), undefined, replyingTo || undefined);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
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
    <div className="bg-white dark:bg-[#1A1F2C] border-t dark:border-gray-800">
      {replyingTo && (
        <div className="px-3 py-2 bg-[#F0F7FF] dark:bg-[#222632] border-b border-[#D3E4FD] dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-8 bg-[#0EA5E9] rounded-full" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Replying to</p>
              <p className="text-sm truncate max-w-[200px] text-gray-700 dark:text-gray-300">
                {getReplyPreview(replyingTo)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelReply}
            className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
        <Label htmlFor="file" className="cursor-pointer hover:text-gray-600 mb-2">
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
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          rows={1}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-full bg-gray-50 dark:bg-gray-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2.5 px-4"
          style={{
            overflow: 'hidden',
            transition: 'height 0.1s ease-out'
          }}
        />
        {message.trim() ? (
          <Button 
            type="submit" 
            disabled={isLoading} 
            size="icon"
            variant="ghost"
            className="hover:bg-gray-100 dark:hover:bg-gray-700 mb-1"
          >
            <Send className="h-5 w-5 text-[#0EA5E9]" />
          </Button>
        ) : (
          <div className="mb-1">
            <VoiceMessageRecorder onRecordingComplete={handleVoiceMessage} />
          </div>
        )}
      </form>
    </div>
  );
};