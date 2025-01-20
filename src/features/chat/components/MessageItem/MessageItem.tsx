import { Message } from "@/types/profile";
import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { MessageContent } from "../MessageContent/MessageContent";
import { ReplyPreview } from "@/components/chat/reply/ReplyPreview";
import { cn } from "@/lib/utils";
import { ArrowUturnLeft } from "@/components/icons/ArrowUturnLeft";
import { useLanguage } from "@/contexts/LanguageContext";

interface MessageItemProps {
  message: Message;
  fromCurrentUser: boolean;
  onDragEnd: (message: Message, info: PanInfo) => void;
}

export const MessageItem = ({ message, fromCurrentUser, onDragEnd }: MessageItemProps) => {
  const { isRTL } = useLanguage();
  const x = useMotionValue(0);
  const swipeProgress = useTransform(x, [-100, 0, 100], [1, 0, 1]);
  const swipeOpacity = useTransform(swipeProgress, [0, 0.3, 1], [0, 0.5, 1]);
  const swipeScale = useTransform(swipeProgress, [0, 1], [0.8, 1]);
  const swipeRotate = useTransform(swipeProgress, [0, 1], [0, isRTL ? -15 : 15]);
  const bubbleScale = useTransform(swipeProgress, [0, 0.3, 1], [1, 0.97, 0.95]);

  const handleDragStart = () => {
    // Add subtle haptic feedback at drag start
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(2);
    }
  };

  const handleDrag = (_, info: PanInfo) => {
    const threshold = 50;
    // Add subtle haptic feedback when crossing threshold
    if (Math.abs(info.offset.x) > threshold && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(3);
    }
  };

  const handleDragEnd = async (_, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      // Add stronger haptic feedback for successful swipe
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([10, 20, 10]); // Pattern for success
      }
      onDragEnd(message, info);
    } else {
      // Add subtle haptic feedback for cancelled swipe
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(2);
      }
    }
  };

  const messageVariants = {
    initial: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0], // iOS spring
        scale: {
          duration: 0.2,
          ease: [0.175, 0.885, 0.32, 1.275] // Custom spring for pop effect
        }
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  // Show reply preview to both users, but only allow deletion for the user who made the reply
  const canDeleteReply = message.replyTo && fromCurrentUser;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={message.id}
        variants={messageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className={cn(
          "w-full px-2 sm:px-4",
          "touch-pan-x", // Enable horizontal touch panning
          "select-none", // Prevent text selection while dragging
          "group", // For hover effects
          "will-change-transform", // Optimize animations
          "active:opacity-90", // iOS-style active state
          "transition-opacity duration-200"
        )}
      >
        <div className={cn(
          "flex flex-col",
          fromCurrentUser ? "items-end" : "items-start",
          "w-full"
        )}>
          {/* Sender name */}
          {message.sender_name && (
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1.0]
              }}
              className={cn(
                "text-[13px] font-medium mb-1", // iOS caption text
                "px-3", // Add padding for better readability
                fromCurrentUser 
                  ? "text-right text-[#007AFF] dark:text-[#0A84FF]" 
                  : "text-left text-[#8E8E93] dark:text-[#98989D]"
              )}
            >
              {message.sender_name}
            </motion.span>
          )}
          
          {/* Message content with reply preview */}
          <div className="relative w-full flex flex-col">
            {/* Reply preview */}
            <AnimatePresence mode="popLayout">
              {message.replyTo && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }}
                  className={cn(
                    "mb-1",
                    fromCurrentUser ? "mr-3" : "ml-3"
                  )}
                >
                  <ReplyPreview 
                    message={{
                      ...message.replyTo,
                      id: 'reply-' + message.id,
                      created_at: message.created_at,
                      updated_at: message.updated_at,
                      user_id: message.user_id,
                      is_from_doctor: message.is_from_doctor,
                      is_read: true,
                      status: 'seen'
                    }} 
                    onCancel={canDeleteReply ? () => {}} : undefined}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message bubble */}
            <div className={cn(
              "flex w-full",
              fromCurrentUser ? "justify-end" : "justify-start"
            )}>
              {/* Swipe indicator */}
              <motion.div
                style={{
                  opacity: swipeOpacity,
                  scale: swipeScale,
                  rotate: swipeRotate
                }}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2",
                  fromCurrentUser ? "-left-8" : "-right-8",
                  isRTL ? "rotate-180" : "",
                  "pointer-events-none" // Prevent interaction with indicator
                )}
              >
                <ArrowUturnLeft className="w-5 h-5 text-[#007AFF] dark:text-[#0A84FF]" />
              </motion.div>

              <motion.div 
                className="relative"
                initial={false}
                animate={{
                  scale: bubbleScale.get()
                }}
                transition={{
                  duration: 0.2,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }}
              >
                <MessageContent 
                  message={message} 
                  fromCurrentUser={fromCurrentUser}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};