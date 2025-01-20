import { X } from "lucide-react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChatImagePreviewProps {
  url: string;
  onClose: () => void;
}

export const ChatImagePreview = ({ url, onClose }: ChatImagePreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [-200, 0, 200], [0.2, 1, 0.2]);
  const scale = useTransform(dragY, [-200, 0, 200], [0.8, 1, 0.8]);

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.y) > 100) {
      // Add haptic feedback
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
      onClose();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1.0], // iOS spring
      }}
      className={cn(
        "fixed inset-0",
        "z-[9999]",
        "bg-black/95",
        "touch-none",
        "will-change-transform"
      )}
      onClick={onClose}
    >
      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0",
              "flex items-center justify-center",
              "bg-black/80",
              "backdrop-blur-xl"
            )}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={cn(
                "w-3 h-3",
                "rounded-full",
                "bg-white/80"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button - positioned for easy thumb reach */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: 0.2,
          delay: 0.1,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
        className={cn(
          "absolute bottom-6 left-1/2 -translate-x-1/2",
          "w-[44px] h-[44px] rounded-full", // iOS minimum touch target
          "bg-white/10",
          "backdrop-blur-xl",
          "flex items-center justify-center",
          "hover:bg-white/20",
          "active:bg-white/30",
          "transition-all duration-200",
          "shadow-lg"
        )}
        onClick={(e) => {
          e.stopPropagation();
          // Add haptic feedback
          if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(5);
          }
          onClose();
        }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="h-6 w-6 text-white" />
        <span className="sr-only">Close preview</span>
      </motion.button>

      {/* Image container with gestures */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center p-4"
        style={{ opacity, scale }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        dragSnapToOrigin
      >
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 300
          }}
        >
          <motion.img
            src={url}
            alt="Preview"
            onLoad={handleImageLoad}
            className={cn(
              "w-auto h-auto",
              "max-w-full max-h-full",
              "object-contain",
              "select-none",
              "rounded-2xl", // iOS-style rounding
              isLoading ? "opacity-0" : "opacity-100",
              "transition-opacity duration-200"
            )}
            style={{
              WebkitTouchCallout: "none",
              userSelect: "none",
              willChange: "transform"
            }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
            whileTap={{ cursor: "grabbing" }}
          />
        </motion.div>
      </motion.div>

      {/* Swipe indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{
          duration: 0.2,
          delay: 0.3
        }}
        className={cn(
          "absolute top-4 left-1/2 -translate-x-1/2",
          "text-[13px] text-white/60",
          "font-medium",
          "pointer-events-none"
        )}
      >
        Swipe to dismiss
      </motion.div>
    </motion.div>
  );
}; 