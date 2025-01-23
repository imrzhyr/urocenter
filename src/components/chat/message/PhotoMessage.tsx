import { useState } from 'react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageStatus } from "../MessageStatus";

interface PhotoMessageProps {
  urls: string[];
  fileNames?: string[];
  content?: string;
  timestamp: Date;
  fromCurrentUser: boolean;
  showStatus?: boolean;
}

export const PhotoMessage = ({ 
  urls, 
  fileNames, 
  content,
  timestamp, 
  fromCurrentUser,
  showStatus 
}: PhotoMessageProps) => {
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % urls.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + urls.length) % urls.length);
  };

  return (
    <>
      <div 
        className={cn(
          "max-w-[400px] md:max-w-[500px]",
          "rounded-2xl overflow-hidden",
          "shadow-sm",
          fromCurrentUser ? "ml-auto" : "",
          fromCurrentUser 
            ? "bg-[#0066CC]" 
            : "bg-white border-2 border-[#0066CC]/20"
        )}
      >
        {/* Image Container */}
        <div 
          onClick={() => setShowImagePreview(true)}
          className="cursor-pointer active:opacity-90 transition-opacity"
        >
          <div className="relative">
            {urls.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{urls.length}
              </div>
            )}
            <img
              src={urls[0]}
              alt={fileNames?.[0] || 'Photo message'}
              className="w-full h-auto object-cover rounded-t-2xl"
              style={{ maxHeight: '50vh' }}
            />
          </div>

          {/* Message Content */}
          {content && (
            <div className={cn(
              "p-3",
              "text-[15px] leading-[1.3]",
              "whitespace-pre-wrap break-words overflow-wrap-anywhere",
              fromCurrentUser ? "text-white" : "text-[#1C1C1E]"
            )}>
              {content}
            </div>
          )}

          {/* Timestamp and Status */}
          <div className={cn(
            "flex items-center gap-1.5",
            "p-3 pt-0",
            "text-[11px] leading-none",
            fromCurrentUser ? "justify-end" : "justify-start"
          )}>
            <span className={fromCurrentUser ? "text-white/80" : "text-[#8E8E93]"}>
              {format(timestamp, 'h:mm a')}
            </span>
            {showStatus && fromCurrentUser && (
              <MessageStatus message={{ created_at: timestamp.toISOString() }} />
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Preview */}
      <AnimatePresence>
        {showImagePreview && (
          <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
            <DialogContent className="max-w-[100vw] max-h-[100vh] h-screen w-screen p-0 overflow-hidden bg-transparent border-0">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full flex items-center justify-center bg-black/90"
                onClick={() => setShowImagePreview(false)}
              >
                {/* Close Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowImagePreview(false);
                  }}
                  className="absolute top-4 right-4 w-[44px] h-[44px] flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Navigation Buttons */}
                {urls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-[44px] h-[44px] flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-[44px] h-[44px] flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {urls.length > 1 && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm">
                    {currentImageIndex + 1} / {urls.length}
                  </div>
                )}

                {/* Image Preview */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="relative w-[800px] h-[800px] max-w-[90vw] max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={urls[currentImageIndex]}
                    alt={fileNames?.[currentImageIndex] || 'Photo preview'}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}; 