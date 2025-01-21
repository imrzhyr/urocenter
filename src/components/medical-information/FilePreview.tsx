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

export const FilePreview = ({ files, onDelete, onPreview }: FilePreviewProps) => {
  const { t } = useLanguage();

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    return File;
  };

  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  return (
    <AnimatePresence mode="popLayout">
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.map((file) => {
          const isImage = file.type.startsWith('image/');

          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springTransition}
              className={cn(
                "relative group rounded-xl overflow-hidden",
                "border border-gray-200/50 dark:border-gray-800/50",
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
                    whileTap={{ scale: 0.9 }}
                    transition={springTransition}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(file.id);
                    }}
                    className={cn(
                      "absolute top-2 right-2 p-2 rounded-full",
                      "bg-black/50 text-white",
                      "hover:bg-black/70",
                      "transition-colors duration-200"
                    )}
                    aria-label={t("delete_file")}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                // Non-image file preview
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={springTransition}
                      className="text-[#007AFF] dark:text-[#0A84FF]"
                    >
                      {React.createElement(getFileIcon(file.type), { size: 24 })}
                    </motion.div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        transition={springTransition}
                        onClick={() => onPreview(file.id)}
                        className={cn(
                          "p-2 rounded-full",
                          "text-[#007AFF] dark:text-[#0A84FF]",
                          "hover:bg-[#007AFF]/10 dark:hover:bg-[#0A84FF]/10",
                          "transition-colors duration-200"
                        )}
                        aria-label={t("preview_file")}
                      >
                        <FileText className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        transition={springTransition}
                        onClick={() => onDelete(file.id)}
                        className={cn(
                          "p-2 rounded-full",
                          "text-red-500 dark:text-red-400",
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
  );
}; 