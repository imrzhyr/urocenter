import React from 'react';
import { Message } from '@/types/profile';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ReplyPreviewProps {
  message: Message;
  onCancel: () => void;
}

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({ message, onCancel }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <div className="flex-1 text-sm truncate">
        <span className="text-muted-foreground">Replying to: </span>
        {message.content}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};