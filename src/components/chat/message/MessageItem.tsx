import { Message } from "@/types/profile";
import { motion } from "framer-motion";
import { MessageContent } from "./MessageContent";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  fromCurrentUser: boolean;
  previousMessage?: Message;
}

export const MessageItem = ({ message, fromCurrentUser, previousMessage }: MessageItemProps) => {
  const [showUnsend, setShowUnsend] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleLongPress = () => {
    if (fromCurrentUser) {
      setShowUnsend(true);
    }
  };

  const handleUnsend = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', message.id);

      if (error) throw error;
      
      toast.success("Message unsent");
      setShowUnsend(false);
    } catch (error) {
      console.error('Error unsending message:', error);
      toast.error("Failed to unsend message");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowUnsend(false);
      }
    };

    const handleScroll = () => {
      setShowUnsend(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return (
    <motion.div
      ref={messageRef}
      key={message.id}
      id={`message-${message.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress();
      }}
      onTouchStart={() => {
        const timer = setTimeout(handleLongPress, 500);
        return () => clearTimeout(timer);
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
            <div className="relative">
              {showUnsend && fromCurrentUser && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 z-10",
                    "right-full mr-2"
                  )}
                >
                  <div className="bg-white dark:bg-[#1C1C1E] rounded-full shadow-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleUnsend}
                      disabled={isDeleting}
                      className="h-8 px-3 text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
                    >
                      <span className="text-[13px] font-medium">Unsend</span>
                    </Button>
                  </div>
                </motion.div>
              )}
              <MessageContent message={message} fromCurrentUser={fromCurrentUser} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};