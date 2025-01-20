import { Message } from "@/types/profile";
import { Check, CheckCheck } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MessageStatusProps {
  message: Message;
}

export const MessageStatus = ({ message }: MessageStatusProps) => {
  const { profile } = useProfile();
  
  const isFromCurrentUser = profile?.role === 'admin' ? message.is_from_doctor : !message.is_from_doctor;
  
  if (!isFromCurrentUser) {
    return null;
  }

  const variants = {
    initial: { 
      opacity: 0,
      scale: 0.8
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1.0], // iOS spring
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.15,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={cn(
        "flex items-center justify-center",
        "w-4 h-4", // Increased touch target
        "will-change-transform" // Optimize animations
      )}
    >
      {message.seen_at ? (
        <CheckCheck className={cn(
          "w-3.5 h-3.5",
          "text-[#007AFF] dark:text-[#0A84FF]", // iOS system blue
          "shrink-0",
          "transition-colors duration-200"
        )} />
      ) : message.delivered_at ? (
        <CheckCheck className={cn(
          "w-3.5 h-3.5",
          "text-[#8E8E93] dark:text-[#98989D]", // iOS secondary text
          "shrink-0",
          "transition-colors duration-200"
        )} />
      ) : (
        <Check className={cn(
          "w-3.5 h-3.5",
          "text-[#8E8E93] dark:text-[#98989D]", // iOS secondary text
          "shrink-0",
          "transition-colors duration-200"
        )} />
      )}
    </motion.div>
  );
};