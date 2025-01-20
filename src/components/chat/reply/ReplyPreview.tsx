import { Message } from "@/types/profile";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export interface ReplyPreviewProps {
  message: Message;
  onCancel?: () => void;
}

export const ReplyPreview = ({ message, onCancel }: ReplyPreviewProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1.0], // iOS spring
      }}
      className={cn(
        "relative",
        isRTL ? "pr-3 pl-2" : "pl-3 pr-2", // RTL support
        "py-2",
        "rounded-xl",
        "bg-[#F2F2F7]/50 dark:bg-[#1C1C1E]/50",
        "backdrop-blur-sm",
        "border border-[#3C3C43]/20 dark:border-white/10",
        "shadow-sm",
        // Quote line with RTL support
        "before:absolute",
        isRTL ? "before:right-0" : "before:left-0",
        "before:top-2 before:bottom-2",
        "before:w-[3px] before:rounded-full",
        "before:bg-[#007AFF] dark:before:bg-[#0A84FF]",
        "will-change-transform" // Optimize animations
      )}>
      <div className={cn(
        "flex items-start justify-between gap-3",
        isRTL && "flex-row-reverse" // RTL support
      )}>
        <div className="flex-1 min-w-0 py-0.5">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className={cn(
              "text-[13px] font-medium", // iOS caption text
              "text-[#007AFF] dark:text-[#0A84FF]",
              "mb-1"
            )}
          >
            {`${t('replying_to')} ${message.sender_name || t('unknown')}`}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className={cn(
              "text-[15px] leading-[1.35]", // iOS body text
              "text-[#3C3C43] dark:text-[#EBEBF5]",
              "line-clamp-2",
              "selection:bg-[#007AFF]/30 dark:selection:bg-[#0A84FF]/30" // iOS text selection
            )}
          >
            {message.content}
          </motion.p>
        </div>
        {onCancel && (
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-[44px] w-[44px]", // iOS minimum touch target
                isRTL ? "-ml-2" : "-mr-2",
                "-mt-2",
                "text-[#3C3C43] dark:text-[#EBEBF5]",
                "hover:bg-[#3C3C43]/10 dark:hover:bg-white/10",
                "active:bg-[#3C3C43]/20 dark:active:bg-white/20", // iOS press state
                "transition-colors duration-200"
              )}
              onClick={() => {
                // Add haptic feedback
                if (window.navigator && window.navigator.vibrate) {
                  window.navigator.vibrate(10);
                }
                onCancel();
              }}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">{t('cancel_reply')}</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};