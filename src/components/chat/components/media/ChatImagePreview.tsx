import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatImagePreviewProps {
  urls: string[];
  onClose?: () => void;
  className?: string;
}

export const ChatImagePreview = React.memo(({ urls, onClose, className }: ChatImagePreviewProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % urls.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + urls.length) % urls.length);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50",
      "bg-black/90",
      "flex items-center justify-center",
      className
    )}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-[90vw] max-h-[90vh]"
        >
          <img
            src={urls[currentIndex]}
            alt={`Preview ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      {urls.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2",
              "p-2 rounded-full",
              "bg-white/10 hover:bg-white/20",
              "transition-colors"
            )}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2",
              "p-2 rounded-full",
              "bg-white/10 hover:bg-white/20",
              "transition-colors"
            )}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </>
      )}

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4",
            "p-2 rounded-full",
            "bg-white/10 hover:bg-white/20",
            "transition-colors"
          )}
        >
          <X className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Image counter */}
      {urls.length > 1 && (
        <div className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2",
          "px-3 py-1 rounded-full",
          "bg-black/50",
          "text-white text-sm"
        )}>
          {currentIndex + 1} / {urls.length}
        </div>
      )}
    </div>
  );
});

ChatImagePreview.displayName = 'ChatImagePreview'; 