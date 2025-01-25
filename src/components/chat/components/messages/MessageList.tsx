import * as React from 'react';
import { format } from 'date-fns';
import type { Message, MessageListProps } from '../../types';
import { MessageItem } from './MessageItem';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export const MessageList = React.memo(({ messages, currentUserId, onMessageSeen, onReply }: MessageListProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = React.useState(true);
  const { ref: bottomRef, inView: isBottomVisible } = useInView();

  // Sort messages by date in ascending order
  const sortedMessages = React.useMemo(() => {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA.getTime() - dateB.getTime();
    });
  }, [messages]);

  // Handle scroll
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isAtBottom);
    setAutoScrollEnabled(isAtBottom);
  }, []);

  // Scroll to bottom with smooth animation
  const scrollToBottom = React.useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setAutoScrollEnabled(true);
    }
  }, []);

  // Auto scroll on new messages
  React.useEffect(() => {
    if (autoScrollEnabled && containerRef.current) {
      scrollToBottom();
    }
  }, [messages, autoScrollEnabled, scrollToBottom]);

  // Group messages by date
  const groupedMessages = React.useMemo(() => {
    const groups: { [key: string]: Message[] } = {};
    sortedMessages.forEach(message => {
      const date = format(new Date(message.created_at), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  }, [sortedMessages]);

  if (!sortedMessages.length) {
    return (
      <div className="h-full flex items-center justify-center bg-[#17212B]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "flex flex-col items-center gap-4",
            "p-6 rounded-2xl",
            "bg-[#232E3C]",
            "text-center"
          )}
        >
          <div className="w-16 h-16 rounded-full bg-[#2B5278] flex items-center justify-center">
            <motion.svg 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-8 h-8 text-white/70" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-base font-medium"
          >
            No messages yet
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-[#17212B]">
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className={cn(
          "h-full overflow-auto py-4",
          "scrollbar-thin scrollbar-thumb-[#2B5278] scrollbar-track-transparent",
          "bg-[#17212B]"
        )}
        style={{
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex flex-col space-y-2">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-1">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center sticky top-2 z-10 mb-4"
              >
                <div className={cn(
                  "px-4 py-1",
                  "text-xs font-medium",
                  "bg-[#232E3C]/80",
                  "text-white/70",
                  "rounded-lg",
                  "backdrop-blur-xl",
                  "shadow-sm"
                )}>
                  {format(new Date(date), 'MMMM d')}
                </div>
              </motion.div>

              <AnimatePresence mode="popLayout">
                {dateMessages.map((message, index) => {
                  const prevMessage = index > 0 ? dateMessages[index - 1] : null;
                  const nextMessage = index < dateMessages.length - 1 ? dateMessages[index + 1] : null;
                  
                  // Show sender info if:
                  // 1. First message in group
                  // 2. Different sender from previous message
                  // 3. Time gap > 5 minutes
                  const showSenderInfo = !prevMessage || 
                    prevMessage.sender_id !== message.sender_id ||
                    Math.abs(new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime()) > 5 * 60 * 1000;
                  
                  // Last in group if:
                  // 1. Last message in group
                  // 2. Different sender from next message
                  // 3. Time gap > 5 minutes
                  const isLastInGroup = !nextMessage || 
                    nextMessage.sender_id !== message.sender_id ||
                    Math.abs(new Date(nextMessage.created_at).getTime() - new Date(message.created_at).getTime()) > 5 * 60 * 1000;

                  return (
                    <MessageItem
                      key={message.id}
                      message={message}
                      currentUserId={currentUserId}
                      showSenderInfo={showSenderInfo}
                      isLastInGroup={isLastInGroup}
                      onMessageSeen={onMessageSeen}
                      onDragEnd={onReply ? (msg: Message, info: { offset: { x: number } }) => {
                        const threshold = 100;
                        if (Math.abs(info.offset.x) > threshold) {
                          onReply(msg);
                        }
                      } : undefined}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={scrollToBottom}
            className={cn(
              "absolute bottom-6 right-6",
              "p-3 rounded-full",
              "bg-[#2B5278]",
              "text-white/90",
              "shadow-lg",
              "transform-gpu transition-transform",
              "hover:bg-[#3A6898] active:scale-95",
              "focus:outline-none"
            )}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});

MessageList.displayName = 'MessageList';