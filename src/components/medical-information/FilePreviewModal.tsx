import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

export const FilePreviewModal = ({ isOpen, onClose, file }: FilePreviewModalProps) => {
  const { t } = useLanguage();

  if (!file) return null;

  const isImage = file.type.startsWith('image/');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={cn(
            "fixed inset-0 z-50",
            "bg-black/90 backdrop-blur-sm",
            "flex items-center justify-center",
            "p-4 sm:p-8"
          )}
        >
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={onClose}
            className={cn(
              "absolute top-4 right-4",
              "p-2 rounded-full",
              "bg-black/50 text-white",
              "hover:bg-black/70",
              "transition-colors duration-200"
            )}
          >
            <X className="w-6 h-6" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-5xl",
              "rounded-xl overflow-hidden",
              "bg-white dark:bg-gray-900"
            )}
          >
            {isImage ? (
              <div className="relative w-full h-[80vh]">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <iframe
                src={file.url}
                title={file.name}
                className="w-full h-[80vh]"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 