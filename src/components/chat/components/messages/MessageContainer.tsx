import * as React from 'react';
import type { MessageContainerProps, Message } from '../../types';
import { MessageList } from './MessageList';
import { MessageInput } from '../input';
import { TypingIndicator } from '../status';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const MessageContainer = React.memo(({ 
  messages, 
  onSendMessage, 
  onTyping, 
  isLoading, 
  header, 
  userId 
}: MessageContainerProps) => {
  const [isReplyingTo, setIsReplyingTo] = React.useState<Message | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Lock body scroll when chat is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle escape key to cancel reply
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsReplyingTo(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col h-full",
        "bg-[#F2F2F7] dark:bg-[#1C1C1E]",
        "overflow-hidden"
      )}
    >
      {/* Header */}
      {header}

      {/* Messages */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 overflow-hidden"
      >
        <div 
          className={cn(
            "h-full w-full",
            "bg-gradient-to-b from-transparent to-black/5 dark:to-white/5"
          )}
          style={{
            backgroundSize: '100% 20px',
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 19px,
              rgba(60, 60, 67, 0.05) 19px,
              rgba(60, 60, 67, 0.05) 20px
            )`,
          }}
        >
          <MessageList 
            messages={messages}
            currentUserId={userId}
            onReply={setIsReplyingTo}
          />
          <AnimatePresence>
            {onTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "flex-none",
          "border-t border-[#3C3C43]/20 dark:border-[#3C3C43]/30",
          "bg-[#F2F2F7] dark:bg-[#1C1C1E]",
          "backdrop-blur-lg"
        )}
      >
        <MessageInput 
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          onTyping={onTyping}
          replyingTo={isReplyingTo}
          onCancelReply={() => setIsReplyingTo(null)}
        />
      </motion.div>
    </motion.div>
  );
});

MessageContainer.displayName = 'MessageContainer'; 