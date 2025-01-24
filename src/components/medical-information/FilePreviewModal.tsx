import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    type: string;
    url: string;
  } | null;
}

export const FilePreviewModal = ({
  isOpen,
  onClose,
  file,
}: FilePreviewModalProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  if (!file) return null;

  const isImage = file.type.startsWith('image/');

  // iOS-style spring animation variants
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.2,
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2,
      }
    }
  };

  const contentVariants = {
    initial: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    animate: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      }
    }
  };

  const buttonVariants = {
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
          onClick={onClose}
          className={cn(
            "fixed inset-0 z-50",
            "bg-black/90 backdrop-blur-xl",
            "flex items-center justify-center",
            "p-4 sm:p-8"
          )}
        >
          {/* Close button */}
          <motion.button
            variants={buttonVariants}
            whileTap="tap"
            onClick={(e) => {
              e.stopPropagation();
              if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(2);
              }
              onClose();
            }}
            className={cn(
              "absolute top-4",
              isRTL ? "left-4" : "right-4",
              "p-2 rounded-full",
              "bg-black/50 backdrop-blur-sm",
              "text-white",
              "hover:bg-black/70",
              "transition-colors duration-200"
            )}
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Navigation buttons */}
          <motion.button
            variants={buttonVariants}
            whileTap="tap"
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              isRTL ? "right-4" : "left-4",
              "p-3 rounded-full",
              "bg-black/50 backdrop-blur-sm",
              "text-white",
              "hover:bg-black/70",
              "transition-colors duration-200",
              "hidden sm:block"
            )}
          >
            {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileTap="tap"
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              isRTL ? "left-4" : "right-4",
              "p-3 rounded-full",
              "bg-black/50 backdrop-blur-sm",
              "text-white",
              "hover:bg-black/70",
              "transition-colors duration-200",
              "hidden sm:block"
            )}
          >
            {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </motion.button>

          {/* Content */}
          <motion.div
            variants={contentVariants}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-5xl",
              "rounded-2xl overflow-hidden",
              "bg-[#1C1C1E]",
              "shadow-2xl"
            )}
          >
            {/* Header */}
            <div className={cn(
              "absolute top-0 left-0 right-0 z-10",
              "px-6 py-4",
              "bg-gradient-to-b from-black/50 to-transparent",
              "backdrop-blur-sm"
            )}>
              <div className={cn(
                "flex items-center justify-between",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                <h2 className={cn(
                  "text-[17px]", // iOS body
                  "font-medium",
                  "text-white"
                )}>
                  {file.name}
                </h2>
                <motion.a
                  variants={buttonVariants}
                  whileTap="tap"
                  href={file.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.navigator && window.navigator.vibrate) {
                      window.navigator.vibrate(2);
                    }
                  }}
                  className={cn(
                    "p-2 rounded-full",
                    "bg-white/10",
                    "text-white",
                    "hover:bg-white/20",
                    "transition-colors duration-200"
                  )}
                >
                  <Download className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Content */}
            <div className="relative w-full h-[80vh]">
              {isImage ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={file.url}
                  title={file.name}
                  className="w-full h-full"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 