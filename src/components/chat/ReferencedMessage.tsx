import React from 'react';
import { Message } from '@/types/profile';

interface ReferencedMessageProps {
  message: NonNullable<Message['referenced_message']>;
}

export const ReferencedMessage: React.FC<ReferencedMessageProps> = ({ message }) => {
  return (
    <div className="mb-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded border-l-2 border-primary text-sm">
      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {message.sender_name || 'Unknown'}
      </div>
      <div className="text-gray-700 dark:text-gray-300 truncate">
        {message.file_type?.startsWith('image/') ? '📷 Photo' :
         message.file_type?.startsWith('video/') ? '🎥 Video' :
         message.file_type?.startsWith('audio/') ? '🎵 Voice message' :
         message.content}
      </div>
    </div>
  );
};