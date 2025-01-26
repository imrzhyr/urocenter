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
import { supabase } from '@/lib/supabase';

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
    const allMessages = document.querySelectorAll('.message-bubble');
    
    if (isLongPressed) {
      // Add a semi-transparent overlay to create iOS-like selection effect
      chatContainer?.classList.add('before:absolute', 'before:inset-0', 'before:bg-black/30', 'before:backdrop-blur-[2px]', 'before:z-10');
      
      // Highlight the selected message
      messageRef.current?.classList.add('z-20', 'scale-[0.98]', 'transition-transform');
      
      // Dim other messages
      allMessages.forEach(msg => {
        if (msg !== messageRef.current) {
          msg.classList.add('opacity-50', 'transition-opacity');
        }
      });
    } else {
      // Remove all effects
      chatContainer?.classList.remove('before:absolute', 'before:inset-0', 'before:bg-black/30', 'before:backdrop-blur-[2px]', 'before:z-10');
      messageRef.current?.classList.remove('z-20', 'scale-[0.98]', 'transition-transform');
      allMessages.forEach(msg => {
        msg.classList.remove('opacity-50', 'transition-opacity');
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

  // Handle message deletion
  const handleDelete = React.useCallback(async () => {
    if (!message?.id) return;
    
    try {
      // First animate the message out
      if (messageRef.current) {
        messageRef.current.style.height = `${messageRef.current.offsetHeight}px`;
        messageRef.current.style.transition = 'all 0.2s ease-out';
        
        // Force a reflow
        messageRef.current.offsetHeight;
        
        // Animate out
        messageRef.current.style.opacity = '0';
        messageRef.current.style.transform = 'scale(0.95)';
        messageRef.current.style.height = '0px';
        messageRef.current.style.marginTop = '0px';
        messageRef.current.style.marginBottom = '0px';
        messageRef.current.style.padding = '0px';
      }

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Then delete from database
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', message.id);
      
      if (error) throw error;
      
      // Close the selection UI
      setIsLongPressed(false);
    } catch (error) {
      console.error('Error deleting message:', error);
      // Reset the animation if there was an error
      if (messageRef.current) {
        messageRef.current.style.removeProperty('height');
        messageRef.current.style.removeProperty('opacity');
        messageRef.current.style.removeProperty('transform');
        messageRef.current.style.removeProperty('margin-top');
        messageRef.current.style.removeProperty('margin-bottom');
        messageRef.current.style.removeProperty('padding');
      }
    }
  }, [message?.id]);

  if (!message) return null;

  // Convert timestamp to string
  const timestampString = typeof message.created_at === 'string' 
    ? message.created_at 
    : (message.created_at as Date).toISOString();

  // Render text content
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

  // Render action buttons when message is selected
  const renderActionButtons = () => {
    if (!isLongPressed) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "absolute bottom-full mb-2",
          "flex items-center gap-2",
          "p-1",
          "rounded-lg",
          "bg-[#1A1A1A]/90",
          "backdrop-blur-lg",
          "shadow-lg",
          fromCurrentUser ? "right-0" : "left-0"
        )}
      >
        <button
          onClick={handleDelete}
          className={cn(
            "p-2",
            "rounded-md",
            "text-red-500",
            "hover:bg-red-500/10",
            "active:scale-95",
            "transition-all"
          )}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </motion.div>
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
    <div 
      ref={messageRef}
      className={cn(
        "relative",
        "message-bubble",
        "transition-all duration-200",
        "w-fit",
        "max-w-[var(--message-max-width)]",
        "rounded-[18px]",
        "px-3.5 py-[6px]",
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
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onContextMenu={(e) => {
        e.preventDefault();
        setIsLongPressed(true);
        triggerHaptic('medium');
      }}
    >
      {renderActionButtons()}
      {message.content && renderTextContent()}
    </div>
  );

  return (
    <div className={cn(
      "flex",
      fromCurrentUser ? "justify-end" : "justify-start",
      "px-1 sm:px-2",
      "w-full",
      "max-w-screen-lg",
      "mx-auto",
      "overflow-hidden",
      "transition-all duration-200"
    )}>
      {messageContent}
    </div>
  );
});

MessageContent.displayName = 'MessageContent'; 