import { Message } from "@/types/profile";
import { motion, AnimatePresence } from "framer-motion";
import { MessageContent } from "./MessageContent";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface MessageItemProps {
  message: Message;
  fromCurrentUser: boolean;
  previousMessage?: Message;
}

export const MessageItem = ({ message, fromCurrentUser, previousMessage }: MessageItemProps) => {
  const [showUnsend, setShowUnsend] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout>();
  const pressStartTimeRef = useRef<number>(0);
  const { t } = useLanguage();

  const handleLongPressStart = () => {
    if (!fromCurrentUser) return;
    
    pressStartTimeRef.current = Date.now();
    setIsLongPressing(true);
    // Initial haptic feedback
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([15]);
    }
    
    longPressTimerRef.current = setTimeout(() => {
      // Just provide haptic feedback but don't show unsend yet
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([8, 30, 8]);
      }
    }, 400);
  };

  const handleLongPressEnd = () => {
    const pressDuration = Date.now() - pressStartTimeRef.current;
    setIsLongPressing(false);
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    // Only show unsend if pressed long enough
    if (pressDuration >= 400) {
      setShowUnsend(true);
      // Light haptic feedback on release
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([5]);
      }
    }
  };

  const handleUnsend = async () => {
    try {
      setIsDeleting(true);
      // Haptic feedback for action
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([10, 20]);
      }

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', message.id);

      if (error) throw error;
      
      toast.success(t("message_unsent"), {
        style: {
          backgroundColor: '#1C1C1E',
          color: '#FFFFFF',
          border: 'none',
        }
      });
      setShowUnsend(false);
    } catch (error) {
      console.error('Error unsending message:', error);
      toast.error(t("failed_to_unsend"), {
        style: {
          backgroundColor: '#1C1C1E',
          color: '#FFFFFF',
          border: 'none',
        }
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!messageRef.current?.contains(event.target as Node)) {
        setShowUnsend(false);
      }
    };

    const handleScroll = () => {
      setShowUnsend(false);
    };

    // Listen for clicks anywhere in the document
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('scroll', handleScroll, true);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={messageRef}
      key={message.id}
      id={`message-${message.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isLongPressing ? 0.97 : 1
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPressStart();
      }}
      onTouchStart={() => {
        handleLongPressStart();
      }}
      onTouchEnd={() => {
        handleLongPressEnd();
      }}
      onTouchCancel={() => {
        handleLongPressEnd();
      }}
      onMouseDown={() => {
        handleLongPressStart();
      }}
      onMouseUp={() => {
        handleLongPressEnd();
      }}
      onMouseLeave={() => {
        handleLongPressEnd();
      }}
      className="w-full px-2 sm:px-4 relative py-1 group"
    >
      <div className={`flex flex-col ${fromCurrentUser ? "items-end" : "items-start"} w-full`}>
        {message.sender_name && (
          <motion.span 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-[13px] mb-1 ${
              fromCurrentUser ? "text-right text-[#0066CC]" : "text-left text-[#0066CC]"
            }`}
          >
            {message.sender_name}
          </motion.span>
        )}

        <div className="relative w-full flex flex-col">
          <div className={`flex ${fromCurrentUser ? 'justify-end' : 'justify-start'} w-full relative`}>
            <div className={cn(
              "relative rounded-2xl overflow-hidden",
              showUnsend && "backdrop-blur-sm bg-black/5"
            )}>
              <AnimatePresence>
                {showUnsend && fromCurrentUser && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                      mass: 0.8
                    }}
                    className={cn(
                      "absolute inset-0 z-10",
                      "flex items-center justify-center",
                      "bg-black/20 backdrop-blur-[2px]"
                    )}
                  >
                    <div className={cn(
                      "bg-[#1C1C1E]/95 backdrop-blur-xl",
                      "rounded-full overflow-hidden",
                      "shadow-lg",
                      "border border-white/10",
                      "transform -translate-y-1"
                    )}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleUnsend}
                        disabled={isDeleting}
                        className={cn(
                          "h-8 px-4",
                          "text-[#FF453A] hover:text-[#FF453A]",
                          "hover:bg-[#FF453A]/10",
                          "transition-colors",
                          "disabled:opacity-50",
                          "rounded-full"
                        )}
                      >
                        <span className="text-[14px] font-medium">{t("unsend")}</span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <MessageContent message={message} fromCurrentUser={fromCurrentUser} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};