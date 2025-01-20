import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PanInfo, motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { messageSound } from "@/utils/audioUtils";
import { useProfile } from "@/hooks/useProfile";
import { MessageItem } from "../MessageItem/MessageItem";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, Loader2, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  onReply?: (message: Message | null) => void;
  replyingTo?: Message | null;
  onRefresh?: () => Promise<void>;
}

export const MessageList = ({ 
  messages, 
  currentUserId, 
  onReply,
  isLoading,
  onRefresh 
}: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const pullProgress = useSpring(0, {
    stiffness: 400,
    damping: 30
  });
  
  const rotateProgress = useSpring(0, {
    stiffness: 400,
    damping: 30
  });
  
  const opacity = useTransform(pullProgress, [0, 0.2, 1], [0, 1, 1]);
  const scale = useTransform(pullProgress, [0, 0.2, 1], [0.8, 1, 1]);
  
  const { profile } = useProfile();
  const { t, language, isRTL } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);

  // Enhanced scroll handling with momentum
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        const progress = Math.min(scrollTop / (scrollHeight - clientHeight), 1);
        setScrollProgress(progress);
        
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
        setShowScrollButton(!isNearBottom);
        
        if (!isNearBottom) {
          setUnreadCount(prev => prev + 1);
          // Add subtle haptic feedback when moving away from bottom
          if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(2);
          }
        } else {
          setUnreadCount(0);
        }
      }
    }
  };
  
  // Group messages by date with memoization
  const getMessageDate = (message: Message) => {
    const date = new Date(message.created_at);
    return date.toDateString();
  };

  const messageGroups = messages.reduce((groups: Record<string, Message[]>, message: Message) => {
    const date = getMessageDate(message);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('yesterday');
    } else {
      return format(date, language === 'ar' ? 'dd/MM/yyyy' : 'MMM d, yyyy');
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior, block: "end" });
    }
    
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior
        });
      }
    }

    // Add haptic feedback based on unread count
    if (window.navigator && window.navigator.vibrate) {
      if (unreadCount > 5) {
        window.navigator.vibrate([5, 10, 5]); // Stronger feedback
      } else {
        window.navigator.vibrate(3); // Subtle feedback
      }
    }
    setUnreadCount(0);
  };

  // Enhanced pull-to-refresh with spring physics and haptics
  const handlePull = async (_, info: PanInfo) => {
    const pullDistance = info.offset.y;
    const maxPull = 150;
    const progress = Math.min(Math.max(pullDistance / maxPull, 0), 1);
    
    pullProgress.set(progress);
    rotateProgress.set(progress * 180);

    // Add subtle haptic feedback during pull
    if (progress > 0.5 && progress < 0.9 && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(2);
    }

    if (progress >= 1 && !isRefreshing && onRefresh) {
      setIsRefreshing(true);
      // Add stronger haptic feedback for refresh trigger
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([10, 20, 10]);
      }
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        pullProgress.set(0);
        rotateProgress.set(0);
      }
    }
  };

  useEffect(() => {
    // Initial scroll
    scrollToBottom("auto");

    // Scroll on new messages with improved timing and animation
    if (messages.length > prevMessagesLength.current) {
      messageSound.play();
      // Add subtle haptic feedback for new messages
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(3);
      }
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    }

    prevMessagesLength.current = messages.length;
  }, [messages]);

  const handleDragEnd = async (message: Message, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(20);
      }
      onReply?.(message);
    }
  };

  const isFromCurrentUser = (message: Message) => {
    if (profile?.role === 'admin') {
      return message.is_from_doctor;
    }
    return !message.is_from_doctor;
  };

  return (
    <div className="relative flex-1">
      <ScrollArea 
        ref={scrollAreaRef}
        onScroll={handleScroll} 
        className={cn(
          "h-full relative",
          "bg-[#F2F2F7] dark:bg-[#000000]", // iOS system background
          "chat-background",
          "overflow-hidden", // Prevent scrollbar during pull
          "overscroll-bounce", // iOS overscroll effect
          "will-change-scroll" // Optimize scrolling performance
        )}
      >
        {/* Pull to refresh indicator */}
        <AnimatePresence>
          {(pullProgress.get() > 0 || isRefreshing) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1.0]
              }}
              style={{ opacity, scale }}
              className="absolute top-0 left-0 right-0 flex justify-center py-4 z-10"
            >
              {isRefreshing ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#8E8E93] dark:text-[#98989D]" />
              ) : (
                <motion.div style={{ rotate: rotateProgress }}>
                  <ChevronDown className="w-6 h-6 text-[#8E8E93] dark:text-[#98989D]" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to bottom button with unread count */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1.0]
              }}
              className={cn(
                "absolute bottom-4",
                isRTL ? "left-4" : "right-4",
                "z-10"
              )}
            >
              <Button
                size="icon"
                variant="secondary"
                onClick={() => scrollToBottom()}
                className={cn(
                  "h-10 w-10",
                  "rounded-full",
                  "bg-white/80 dark:bg-[#1C1C1E]/80",
                  "backdrop-blur-xl",
                  "shadow-lg",
                  "hover:bg-white dark:hover:bg-[#1C1C1E]",
                  "active:scale-95",
                  "transition-all duration-200"
                )}
              >
                <ArrowDown className="h-5 w-5 text-[#3C3C43] dark:text-[#98989D]" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={cn(
                      "absolute -top-1 -right-1",
                      "min-w-[20px] h-5",
                      "px-1",
                      "rounded-full",
                      "bg-[#FF3B30] dark:bg-[#FF453A]", // iOS red
                      "text-[11px] font-bold text-white",
                      "flex items-center justify-center",
                      "shadow-sm"
                    )}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.3}
          onDrag={handlePull}
          className={cn(
            "flex flex-col",
            "py-4 px-4 md:px-6",
            "min-h-full w-full",
            "overflow-x-hidden",
            "will-change-transform",
            "touch-pan-y" // Enable vertical touch panning
          )}
        >
          {/* Messages grouped by date */}
          <AnimatePresence mode="popLayout">
            {Object.entries(messageGroups).map(([date, groupMessages]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.2,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }}
                className="space-y-4"
              >
                {/* Date separator */}
                <div className="flex items-center justify-center my-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.2,
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }}
                    className={cn(
                      "px-3 py-1",
                      "rounded-full",
                      "bg-[#F2F2F7]/80 dark:bg-[#2C2C2E]/80",
                      "backdrop-blur-xl",
                      "text-[13px] font-medium",
                      "text-[#3C3C43] dark:text-[#98989D]",
                      "shadow-sm"
                    )}
                  >
                    {formatDate(date)}
                  </motion.div>
                </div>

                {/* Messages for this date */}
                {groupMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }}
                  >
                    <MessageItem
                      message={message}
                      fromCurrentUser={isFromCurrentUser(message)}
                      onDragEnd={handleDragEnd}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-center py-4"
            >
              <Loader2 className="w-6 h-6 animate-spin text-[#8E8E93] dark:text-[#98989D]" />
            </motion.div>
          )}

          <div ref={scrollRef} />
        </motion.div>
      </ScrollArea>
    </div>
  );
};