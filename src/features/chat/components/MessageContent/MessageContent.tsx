import { Message } from "@/types/profile";
import { format } from "date-fns";
import { MessageStatus } from "../MessageStatus/MessageStatus";
import { AudioPlayer } from "../AudioPlayer/AudioPlayer";
import { MediaGallery } from "../MediaGallery/MediaGallery";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
}

export const MessageContent = ({ message, fromCurrentUser }: MessageContentProps) => {
  const { isRTL } = useLanguage();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1.0] // iOS spring
      }}
      className={cn(
        "max-w-[85%] sm:max-w-[70%] md:max-w-[60%]",
        "min-h-[44px]", // iOS minimum touch target
        "p-3 space-y-2", // Increased spacing
        "rounded-2xl", // iOS message bubble radius
        "shadow-sm",
        "break-words",
        "transition-colors duration-200",
        fromCurrentUser
          ? cn(
              "bg-[#007AFF] dark:bg-[#0A84FF]", // iOS system blue
              "text-white",
              "ml-auto",
              isRTL ? "rounded-tr-sm" : "rounded-tl-sm" // iOS message tail
            )
          : cn(
              "bg-[#F2F2F7] dark:bg-[#1C1C1E]", // iOS system gray
              "text-[#000000] dark:text-white",
              isRTL ? "rounded-tl-sm" : "rounded-tr-sm", // iOS message tail
              "border border-[#3C3C43]/10 dark:border-white/10"
            )
      )}
    >
      {/* Media content */}
      {message.file_url && (
        <div className={cn(
          "-m-3 mb-2", // Negative margin to extend media to edges
          "first:mb-0 last:mb-0", // Remove margin if it's the only content
          "overflow-hidden",
          "rounded-t-2xl", // Match bubble radius
          fromCurrentUser
            ? isRTL ? "rounded-tr-sm" : "rounded-tl-sm"
            : isRTL ? "rounded-tl-sm" : "rounded-tr-sm"
        )}>
          {message.file_type?.startsWith('audio/') ? (
            <AudioPlayer
              audioUrl={message.file_url}
              messageId={message.id}
              duration={message.duration}
              fromCurrentUser={fromCurrentUser}
            />
          ) : (message.file_type?.startsWith('image/') || message.file_type?.startsWith('video/')) ? (
            <MediaGallery
              url={message.file_url}
              type={message.file_type}
              name={message.file_name || ''}
            />
          ) : null}
        </div>
      )}
      
      {/* Text content */}
      {message.content && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "text-[15px]", // iOS message text size
            "leading-[1.35]", // iOS line height
            "whitespace-pre-wrap break-words",
            "selection:bg-[#007AFF]/30 dark:selection:bg-[#0A84FF]/30" // iOS text selection
          )}
        >
          {message.content}
        </motion.p>
      )}
      
      {/* Message metadata */}
      <div className={cn(
        "flex items-center gap-2",
        "mt-1 -mb-1", // Adjust spacing
        "text-[11px]", // iOS caption size
        fromCurrentUser ? "justify-end" : "justify-start"
      )}>
        <span className={cn(
          fromCurrentUser 
            ? "text-white/80"
            : "text-[#8E8E93] dark:text-[#98989D]" // iOS secondary text
        )}>
          {format(new Date(message.created_at), 'HH:mm')}
        </span>
        {fromCurrentUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              delay: 0.1,
              ease: [0.175, 0.885, 0.32, 1.275] // Custom spring for pop effect
            }}
          >
            <MessageStatus message={message} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};