import * as React from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { MessageContentProps } from '../../types';
import { AudioPlayer } from '../media/AudioPlayer';
import { PhotoMessage } from '../media/PhotoMessage';
import { MessageStatus } from '../status/MessageStatus';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

// Safe timestamp formatting function
const formatTimestamp = (timestamp: string | Date | null | undefined): string => {
  if (!timestamp) return '';
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return format(date as Date, 'h:mm a');
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
};

export const MessageContent = React.memo(({ message, fromCurrentUser }: MessageContentProps) => {
  const [isLongPressed, setIsLongPressed] = React.useState(false);
  const { triggerHaptic } = useHapticFeedback();
  const longPressTimeoutRef = React.useRef<NodeJS.Timeout>();
  const messageRef = React.useRef<HTMLDivElement>(null);

  // Update max width based on screen size
  React.useEffect(() => {
    const updateMaxWidth = () => {
      const screenWidth = window.innerWidth;
      const maxWidth = Math.min(screenWidth * 0.65, 600); // 65% of screen width, max 600px
      document.documentElement.style.setProperty('--message-max-width', `${maxWidth}px`);
    };

    updateMaxWidth();
    window.addEventListener('resize', updateMaxWidth);
    return () => window.removeEventListener('resize', updateMaxWidth);
  }, []);

  // Handle long press for message actions
  const handleTouchStart = React.useCallback(() => {
    longPressTimeoutRef.current = setTimeout(() => {
      setIsLongPressed(true);
      triggerHaptic('medium');
    }, 500);
  }, [triggerHaptic]);

  const handleTouchEnd = React.useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, []);

  // Add backdrop blur when long pressed
  React.useEffect(() => {
    const chatContainer = document.querySelector('.chat-container');
    const allMessages = document.querySelectorAll('.message-content');
    
    if (isLongPressed) {
      chatContainer?.classList.add('backdrop-blur-sm', 'transition-all', 'duration-200');
      // Blur all messages except the current one
      allMessages.forEach(msg => {
        if (msg !== messageRef.current) {
          msg.classList.add('opacity-50', 'blur-[1px]', 'transition-all', 'duration-200');
        }
      });
    } else {
      chatContainer?.classList.remove('backdrop-blur-sm', 'transition-all', 'duration-200');
      allMessages.forEach(msg => {
        msg.classList.remove('opacity-50', 'blur-[1px]', 'transition-all', 'duration-200');
      });
    }
  }, [isLongPressed]);

  // Handle touch move to cancel long press
  const handleTouchMove = React.useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
    setIsLongPressed(false);
  }, []);

  if (!message) return null;

  // Convert timestamp to string
  const timestampString = typeof message.created_at === 'string' 
    ? message.created_at 
    : message.created_at.toISOString();

  // Handle text messages
  const renderTextContent = () => {
    return (
      <div>
        <p className={cn(
          "text-[17px]",
          "leading-[22px]",
          "font-normal",
          "select-text",
          "break-words",
          fromCurrentUser ? "text-white" : "text-[#222]"
        )}>
          {message.content.trim()}
        </p>
        
        <div className={cn(
          "flex items-center gap-1",
          "mt-[2px]",
          "justify-end",
          "text-[12px]",
          "font-normal",
          fromCurrentUser ? "text-white/70" : "text-[#222]/50",
          "whitespace-nowrap",
          "-mb-[2px]"
        )}>
          <span>{formatTimestamp(message.created_at)}</span>
          {fromCurrentUser && <MessageStatus message={message} />}
        </div>
      </div>
    );
  };

  // Handle photo/video messages
  if (message.files?.some(f => f.type?.startsWith('image/') || f.type?.startsWith('video/')) || 
      (message.file_url && (message.file_type?.startsWith('image/') || message.file_type?.startsWith('video/')))) {
    return (
      <div className={cn(
        "w-full flex",
        fromCurrentUser ? "justify-end" : "justify-start",
        "px-1 sm:px-2"
      )}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "relative group",
            "w-[75%] sm:w-[65%]",
            "max-w-[440px]",
            "rounded-2xl",
            "transform-gpu",
            "overflow-hidden",
            fromCurrentUser 
              ? [
                  "mr-1",
                  "shadow-sm shadow-black/10"
                ]
              : [
                  "ml-1",
                  "shadow-sm shadow-black/10"
                ]
          )}>
          <PhotoMessage
            urls={message.files?.map(f => f.url) || (message.file_url ? [message.file_url] : [])}
            fileNames={message.files?.map(f => f.name) || (message.file_name ? [message.file_name] : [])}
            content={message.content}
            timestamp={timestampString}
            fromCurrentUser={fromCurrentUser}
            showStatus
          />
        </motion.div>
      </div>
    );
  }

  // Handle audio messages
  if (message.files?.some(f => f.type?.startsWith('audio/')) || 
      (message.file_url && message.file_type?.startsWith('audio/'))) {
    const audioFile = message.files?.find(f => f.type?.startsWith('audio/')) || {
      url: message.file_url!,
      duration: message.duration!
    };
    
    return (
      <div className={cn(
        "w-full flex",
        fromCurrentUser ? "justify-end" : "justify-start",
        "px-1 sm:px-2"
      )}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "relative group",
            "w-[95%] sm:w-[85%]",
            "max-w-[680px]",
            "rounded-2xl",
            "transform-gpu",
            fromCurrentUser 
              ? [
                  "bg-[#3B9EDB]",
                  "mr-1",
                  "shadow-sm shadow-black/5"
                ]
              : [
                  "bg-[#F0F0F0]",
                  "ml-1",
                  "shadow-sm shadow-black/5"
                ]
          )}>
          <div className="px-4 pt-2.5 pb-2">
            <AudioPlayer
              audioUrl={audioFile.url}
              messageId={message.id}
              duration={('duration' in audioFile ? audioFile.duration : message.duration) || 0}
              isUserMessage={fromCurrentUser}
            />
            {/* Message metadata - On new line */}
            <div className={cn(
              "flex items-center gap-1.5",
              "justify-end",
              "mt-0.5",
              "text-[12px]",
              "font-normal",
              fromCurrentUser ? "text-white/70" : "text-[#222]/50",
              "whitespace-nowrap"
            )}>
              <span>
                {formatTimestamp(message.created_at)}
              </span>
              {fromCurrentUser && <MessageStatus message={message} />}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const messageContent = (
    <motion.div 
      ref={messageRef}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ 
        scale: isLongPressed ? 0.95 : 1,
        opacity: isLongPressed ? 1 : 1,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        scale: {
          type: "tween",
          duration: 0.1
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleTouchEnd}
      className={cn(
        "relative group message-content",
        "w-fit",
        "max-w-[var(--message-max-width)]",
        "rounded-[18px]",
        "px-3.5 py-[6px]",
        "transform-gpu",
        "transition-all duration-200",
        isLongPressed && "scale-95 shadow-lg z-50",
        fromCurrentUser 
          ? [
              "bg-[#3B9EDB]",
              "mr-1",
              "shadow-sm shadow-black/5"
            ]
          : [
              "bg-[#F0F0F0]",
              "ml-1",
              "shadow-sm shadow-black/5"
            ]
      )}>
      {renderTextContent()}
      
      {/* Message actions menu */}
      <AnimatePresence>
        {isLongPressed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10"
              onClick={() => setIsLongPressed(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "absolute -top-14 z-20",
                "flex items-center",
                "py-2.5 px-4",
                "rounded-2xl",
                "bg-[#1C1C1E]/90",
                "backdrop-blur-xl",
                "shadow-lg shadow-black/20",
                "border border-white/[0.08]",
                fromCurrentUser ? "right-0" : "left-0"
              )}
            >
              {fromCurrentUser && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    triggerHaptic('medium');
                    setIsLongPressed(false);
                    onDelete?.(message.id);
                  }}
                  className={cn(
                    "flex items-center gap-2",
                    "text-[15px] font-medium",
                    "text-red-500",
                    "transition-colors"
                  )}
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                  <span>Unsend Message</span>
                </motion.button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className={cn(
      "flex",
      fromCurrentUser ? "justify-end" : "justify-start",
      "px-1 sm:px-2",
      "w-full",
      "max-w-screen-lg",
      "mx-auto"
    )}>
      {messageContent}
    </div>
  );
});

MessageContent.displayName = 'MessageContent'; 