import * as React from 'react';
import { motion } from 'framer-motion';
import type { Message, MessageItemProps } from '../../types';
import { MessageContent } from './MessageContent';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

export const MessageItem = React.memo(React.forwardRef<HTMLDivElement, MessageItemProps>(({ 
  message, 
  currentUserId, 
  showSenderInfo,
  isLastInGroup = false,
  onMessageSeen,
  onDragEnd 
}, ref) => {
  const fromCurrentUser = message.sender_id === currentUserId;
  const { triggerHaptic } = useHapticFeedback();
  const [isLongPressing, setIsLongPressing] = React.useState(false);
  const longPressTimerRef = React.useRef<NodeJS.Timeout>();
  const messageRef = React.useRef<HTMLDivElement>(null);

  // Mark message as seen
  React.useEffect(() => {
    if (!fromCurrentUser && onMessageSeen && message.status !== 'seen') {
      onMessageSeen(message.id);
    }
  }, [fromCurrentUser, message.id, message.status, onMessageSeen]);

  // Handle long press
  const handleLongPressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      triggerHaptic('medium');
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setIsLongPressing(false);
  };

  return (
    <motion.div 
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isLongPressing ? 0.98 : 1
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      drag={onDragEnd ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => onDragEnd?.(message, info)}
      className={cn(
        "w-full px-2",
        isLastInGroup ? "mb-2" : "mb-0.5", // Telegram's message spacing
        "group"
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPressStart();
      }}
      onTouchStart={handleLongPressStart}
      onTouchEnd={handleLongPressEnd}
      onTouchCancel={handleLongPressEnd}
      onMouseDown={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      onMouseLeave={handleLongPressEnd}
    >
      <div className={cn(
        "flex flex-col",
        fromCurrentUser ? "items-end" : "items-start",
        "w-full"
      )}>
        {showSenderInfo && message.sender_name && (
          <motion.span 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-[13px] mb-1 font-medium",
              "tracking-tight",
              "text-[#707579]", // Telegram's sender name color
              "px-3" // Align with message padding
            )}
          >
            {message.sender_name}
          </motion.span>
        )}

        <div className={cn(
          "flex items-end gap-2",
          fromCurrentUser ? "flex-row-reverse" : "flex-row"
        )}>
          {/* Message Content */}
          <div className={cn(
            "max-w-[420px]", // Telegram's max message width
            "transform-gpu transition-transform duration-200",
            isLongPressing && "scale-[0.98]"
          )}>
            <MessageContent 
              message={message}
              fromCurrentUser={fromCurrentUser}
            />
          </div>
        </div>
      </div>

      {/* Reply swipe indicator */}
      {onDragEnd && (
        <motion.div
          className={cn(
            "absolute top-1/2 -translate-y-1/2",
            fromCurrentUser ? "left-4" : "right-4",
            "w-6 h-6",
            "rounded-full",
            "bg-white", // Telegram's reply indicator background
            "text-[#707579]", // Telegram's reply indicator color
            "flex items-center justify-center",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200",
            "shadow-sm"
          )}
          initial={false}
          animate={{
            opacity: isLongPressing ? 1 : 0,
            scale: isLongPressing ? 1.1 : 1
          }}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 10h10a4 4 0 0 1 4 4v2m0-6h4m-4 0v-4m0 4v4" 
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}));

MessageItem.displayName = 'MessageItem'; 