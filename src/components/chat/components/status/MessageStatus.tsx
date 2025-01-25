import * as React from 'react';
import { Check } from 'lucide-react';
import type { MessageStatusProps } from '../../types';
import { cn } from '@/lib/utils';

export const MessageStatus = React.memo(({ message }: MessageStatusProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {/* First checkmark */}
      <Check className="w-3 h-3 text-white/70" />
      
      {/* Second checkmark for delivered/seen */}
      {(message.status === 'delivered' || message.status === 'seen') && (
        <Check className={cn(
          "w-3 h-3 -ml-1.5",
          message.status === 'seen' ? "text-white/90" : "text-white/70"
        )} />
      )}
    </div>
  );
});

MessageStatus.displayName = 'MessageStatus'; 