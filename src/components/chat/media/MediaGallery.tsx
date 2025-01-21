import React from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface MediaGalleryProps {
  url: string;
  type: string;
  name: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  url,
  type,
  name,
}) => {
  const springTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  };

  const isImage = type.startsWith('image/');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={springTransition}
      className={cn(
        'relative group rounded-xl overflow-hidden',
        'border border-gray-200/50 dark:border-gray-800/50',
        'shadow-sm hover:shadow-md transition-shadow duration-200',
        isImage ? 'aspect-square' : 'p-3'
      )}
    >
      {isImage ? (
        <div className="relative w-full h-full">
          <img
            src={url}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springTransition}
              className="text-primary"
            >
              {type.includes('pdf') ? (
                <FileText className="w-6 h-6" />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </motion.div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
              {name}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}; 