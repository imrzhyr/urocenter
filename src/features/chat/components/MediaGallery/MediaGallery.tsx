import { useState, useRef } from 'react';
import { ChatImagePreview } from '../ChatImagePreview/ChatImagePreview';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Play, Loader2, Volume2, VolumeX } from 'lucide-react';

interface MediaGalleryProps {
  url: string;
  type: string;
  name: string;
}

export const MediaGallery = ({ url, type, name }: MediaGalleryProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
        // Add haptic feedback
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(3);
        }
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
        // Add haptic feedback
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(2);
        }
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
      // Add haptic feedback
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(2);
      }
    }
  };

  if (type.startsWith('image/')) {
    return (
      <motion.div 
        className="relative group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.1, 0.25, 1.0] // iOS spring
        }}
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
                "bg-[#F2F2F7]/50 dark:bg-[#1C1C1E]/50",
                "backdrop-blur-xl",
                "rounded-lg"
              )}
            >
              <Loader2 className="w-6 h-6 animate-spin text-[#8E8E93] dark:text-[#98989D]" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.img
          src={url}
          alt={name}
          onLoad={handleImageLoad}
          className={cn(
            "max-w-full",
            "rounded-lg",
            "cursor-zoom-in",
            "transition-all duration-200",
            "will-change-transform",
            "object-contain", // Prevent distortion
            "group-hover:brightness-95 dark:group-hover:brightness-90",
            "shadow-sm"
          )}
          onClick={() => {
            // Add haptic feedback
            if (window.navigator && window.navigator.vibrate) {
              window.navigator.vibrate(3);
            }
            setShowPreview(true);
          }}
          whileHover={{ scale: 0.98 }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1.0]
          }}
        />

        <AnimatePresence>
          {showPreview && (
            <ChatImagePreview 
              url={url}
              onClose={() => setShowPreview(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (type.startsWith('video/')) {
    return (
      <motion.div
        className="relative group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
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
                "bg-[#F2F2F7]/50 dark:bg-[#1C1C1E]/50",
                "backdrop-blur-xl",
                "z-10",
                "rounded-lg"
              )}
            >
              <Loader2 className="w-6 h-6 animate-spin text-[#8E8E93] dark:text-[#98989D]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video controls overlay */}
        <AnimatePresence>
          {!isVideoPlaying && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute inset-0",
                "flex items-center justify-center",
                "bg-black/10",
                "backdrop-blur-sm",
                "z-10",
                "cursor-pointer",
                "group",
                "rounded-lg"
              )}
              onClick={handleVideoClick}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-[44px] h-[44px]", // iOS minimum touch target
                  "rounded-full",
                  "bg-white/90 dark:bg-[#1C1C1E]/90",
                  "backdrop-blur-xl",
                  "flex items-center justify-center",
                  "shadow-lg",
                  "group-hover:bg-white dark:group-hover:bg-[#1C1C1E]",
                  "transition-all duration-200"
                )}
              >
                <Play className="w-5 h-5 text-[#007AFF] dark:text-[#0A84FF] ml-0.5" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Volume control */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          className={cn(
            "absolute top-2 right-2",
            "w-[32px] h-[32px]",
            "rounded-full",
            "bg-black/40",
            "backdrop-blur-xl",
            "flex items-center justify-center",
            "z-20",
            "opacity-0 group-hover:opacity-100",
            "transition-all duration-200",
            "shadow-lg"
          )}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </motion.button>

        <video
          ref={videoRef}
          src={url}
          onLoadedData={handleVideoLoad}
          onClick={handleVideoClick}
          className={cn(
            "max-w-full",
            "rounded-lg",
            "cursor-pointer",
            "will-change-transform",
            "object-contain", // Prevent distortion
            "shadow-sm",
            "group-hover:brightness-95 dark:group-hover:brightness-90",
            "transition-all duration-200"
          )}
          playsInline // Better mobile experience
          preload="metadata" // Faster initial load
          muted={isMuted}
          loop // Auto loop videos
        />
      </motion.div>
    );
  }

  return null;
};