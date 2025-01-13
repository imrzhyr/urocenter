import React from 'react';
import { Message } from '@/types/profile';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReplyPreviewProps {
  message: Message;
  onCancelReply: () => void;
}

export const ReplyPreview = ({ message, onCancelReply }: ReplyPreviewProps) => {
  const getPreviewContent = (message: Message) => {
    if (message.file_type?.startsWith('audio/')) return '🎵 Voice message';
    if (message.file_type?.startsWith('image/')) return '📷 Photo';
    if (message.file_type?.startsWith('video/')) return '🎥 Video';
    return message.content?.slice(0, 50) + (message.content?.length > 50 ? '...' : '');
  };

  return (
    <div className="px-3 py-2 bg-[#F0F7FF] dark:bg-[#222632] border-b border-[#D3E4FD] dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-1 h-8 bg-[#0EA5E9] rounded-full" />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Replying to {message.sender_name || 'Unknown'}
          </p>
          <p className="text-sm truncate max-w-[200px] text-gray-700 dark:text-gray-300">
            {getPreviewContent(message)}
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
  );
};