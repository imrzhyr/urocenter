import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Image as ImageIcon, File } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface FilePreviewProps {
  files: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    thumbnailUrl?: string;
  }>;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
}

export const FilePreview = ({
  files,
  onDelete,
  onPreview,
}: FilePreviewProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    return File;
  };

  // iOS-style spring animation variants
  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fileVariants = {
    initial: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: springTransition
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    tap: {
      scale: 0.95,
      transition: springTransition
    }
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={cn(
        "rounded-2xl overflow-hidden",
        "bg-[#1C1C1E]",
        "border border-[#38383A]",
        "shadow-sm"
      )}
    >
      <div className={cn(
        "px-6 py-4",
        "bg-[#2C2C2E]",
        "border-b border-[#38383A]"
      )}>
        <h2 className={cn(
          "text-[22px]", // iOS headline
          "font-semibold",
          "text-white",
          isRTL ? "text-right" : "text-left"
        )}>
          {t("uploaded_files")}
        </h2>
      </div>

      <div className="p-6">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file) => {
              const isImage = file.type.startsWith('image/');

              return (
                <motion.div
                  key={file.id}
                  variants={fileVariants}
                  layout
                  className={cn(
                    "relative group rounded-xl overflow-hidden",
                    "border border-[#38383A]",
                    "shadow-sm hover:shadow-md transition-shadow duration-200",
                    isImage ? "aspect-square" : "p-3"
                  )}
                >
                  {isImage ? (
                    // Image preview
                    <div className="relative w-full h-full" onClick={() => onPreview(file.id)}>
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                      <motion.button
                        variants={buttonVariants}
                        whileTap="tap"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.navigator && window.navigator.vibrate) {
                            window.navigator.vibrate(2);
                          }
                          onDelete(file.id);
                        }}
                        className={cn(
                          "absolute top-2 right-2 p-2 rounded-full",
                          "bg-black/50 backdrop-blur-sm",
                          "text-white",
                          "hover:bg-black/70",
                          "transition-colors duration-200",
                          "opacity-0 group-hover:opacity-100",
                          "scale-90 group-hover:scale-100",
                          "transform transition-all duration-200"
                        )}
                        aria-label={t("delete_file")}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ) : (
                    // Non-image file preview
                    <div className={cn(
                      "flex items-center gap-4",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <div className={cn(
                        "w-12 h-12 rounded-lg",
                        "bg-[#2C2C2E]",
                        "flex items-center justify-center"
                      )}>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={springTransition}
                          className="text-[#0A84FF]"
                        >
                          {React.createElement(getFileIcon(file.type), { size: 24 })}
                        </motion.div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-[15px]", // iOS subheadline
                          "font-medium",
                          "truncate",
                          "text-white"
                        )}>
                          {file.name}
                        </p>
                        <div className={cn(
                          "flex items-center gap-2 mt-2",
                          isRTL ? "flex-row-reverse" : "flex-row"
                        )}>
                          <motion.button
                            variants={buttonVariants}
                            whileTap="tap"
                            onClick={() => {
                              if (window.navigator && window.navigator.vibrate) {
                                window.navigator.vibrate(2);
                              }
                              onPreview(file.id);
                            }}
                            className={cn(
                              "p-2 rounded-full",
                              "text-[#0A84FF]",
                              "hover:bg-[#0A84FF]/10",
                              "transition-colors duration-200"
                            )}
                            aria-label={t("preview_file")}
                          >
                            <FileText className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            variants={buttonVariants}
                            whileTap="tap"
                            onClick={() => {
                              if (window.navigator && window.navigator.vibrate) {
                                window.navigator.vibrate(2);
                              }
                              onDelete(file.id);
                            }}
                            className={cn(
                              "p-2 rounded-full",
                              "text-red-400",
                              "hover:bg-red-500/10",
                              "transition-colors duration-200"
                            )}
                            aria-label={t("delete_file")}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 