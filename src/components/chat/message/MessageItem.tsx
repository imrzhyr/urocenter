import { Message } from "@/types/profile";
import { motion, PanInfo } from "framer-motion";
import { MessageContent } from "./MessageContent";
import { ReplyPreview } from "@/components/chat/reply/ReplyPreview";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MessageItemProps {
  message: Message;
  fromCurrentUser: boolean;
  onDragEnd: (message: Message, info: PanInfo) => void;
}

export const MessageItem = ({ message, fromCurrentUser, onDragEnd }: MessageItemProps) => {
  const [showUnsend, setShowUnsend] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1]
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => onDragEnd(message, info)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress();
      }}
      onTouchStart={() => {
        const timer = setTimeout(handleLongPress, 500);
        return () => clearTimeout(timer);
      }}
      className="w-full px-2 sm:px-4 relative"
    >
      <div className={`flex flex-col ${fromCurrentUser ? "items-end" : "items-start"} w-full`}>
        {message.sender_name && (
          <span className={`text-sm mb-1 ${
            fromCurrentUser ? "text-right text-[#0066CC]" : "text-left text-gray-600 dark:text-gray-300"
          }`}>
            {message.sender_name}
          </span>
        )}
        
        <div className="relative w-full flex flex-col">
          {message.replyTo && (
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
              onCancel={() => {}}
            />
          )}
          <div className={`flex ${fromCurrentUser ? 'justify-end' : 'justify-start'} w-full group relative`}>
            {showUnsend && fromCurrentUser && (
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 absolute -top-4 -right-4 z-10"
                onClick={handleUnsend}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <MessageContent message={message} fromCurrentUser={fromCurrentUser} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};