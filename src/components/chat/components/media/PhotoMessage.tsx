import * as React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Play } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { MessageStatus } from '../status/MessageStatus';
import type { PhotoMessageProps } from '../../types';

export const PhotoMessage = React.memo(({ 
  urls, 
  fileNames, 
  content, 
  timestamp, 
  fromCurrentUser,
  showStatus 
}: PhotoMessageProps) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const isVideo = fileNames?.[0]?.match(/\.(mp4|mov|avi|wmv)$/i);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  return (
    <div className="relative group">
      {/* Media container */}
      <div className={cn(
        "relative overflow-hidden",
        "aspect-[4/3]",
        "bg-black/5",
        "rounded-[18px]", // Telegram's media radius
        !isLoaded && "animate-pulse"
      )}>
        {/* Loading/Error state */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className={cn(
              "w-8 h-8",
              error ? "text-red-500" : "text-gray-400"
            )} />
          </div>
        )}

        {/* Image */}
        <motion.img
          src={urls[0]}
          alt={fileNames?.[0] || 'Photo'}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          className={cn(
            "w-full h-full",
            "object-cover",
            "select-none",
            isLoaded ? "visible" : "invisible"
          )}
          draggable={false}
        />

        {/* Video play button */}
        {isVideo && isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className={cn(
              "w-12 h-12",
              "rounded-full",
              "bg-black/40",
              "backdrop-blur-sm",
              "flex items-center justify-center",
              "text-white"
            )}>
              <Play className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Caption */}
        {content && (
          <div className={cn(
            "absolute bottom-0 left-0 right-0",
            "p-3",
            "bg-gradient-to-t from-black/50 to-transparent",
            "backdrop-blur-sm"
          )}>
            <p className={cn(
              "text-[15px]",
              "leading-[20px]",
              "font-normal",
              "text-white",
              "break-words",
              "line-clamp-3"
            )}>
              {content}
            </p>
          </div>
        )}

        {/* Timestamp and status */}
        <div className={cn(
          "absolute bottom-2 right-2",
          "flex items-center gap-1",
          "px-1.5 py-0.5",
          "rounded-md",
          "bg-black/40",
          "backdrop-blur-[2px]",
          "text-[12px]",
          "font-normal",
          "text-white/90"
        )}>
          <span>
            {format(
              typeof timestamp === 'string' ? parseISO(timestamp) : timestamp,
              'h:mm a'
            )}
          </span>
          {showStatus && fromCurrentUser && (
            <div className="text-white/90">
              <MessageStatus message={{
                id: 'temp',
                content: '',
                sender_id: '',
                receiver_id: '',
                created_at: timestamp,
                updated_at: timestamp,
                status: 'sent',
                is_from_doctor: false
              }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PhotoMessage.displayName = 'PhotoMessage'; 