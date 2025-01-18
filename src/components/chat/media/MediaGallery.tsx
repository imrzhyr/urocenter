import { useState, useEffect } from 'react';
import { ImageViewer } from './ImageViewer';
import { toast } from "sonner";

interface MediaGalleryProps {
  url: string;
  type: string;
  name: string;
}

export const MediaGallery = ({ url, type, name }: MediaGalleryProps) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isVideo = type?.startsWith('video/');

  useEffect(() => {
    const checkMediaAccess = async () => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error('Media not accessible');
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Media access error:', err);
        setError('Unable to load media');
        setIsLoading(false);
        toast.error('Failed to load media');
      }
    };

    checkMediaAccess();
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-[200px] h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-[200px] h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className="relative rounded-lg overflow-hidden max-w-[200px] cursor-pointer hover:opacity-95 transition-opacity"
        onClick={() => !isVideo && setIsImageViewerOpen(true)}
      >
        {isVideo ? (
          <video 
            className="w-full h-full object-cover rounded-lg max-h-[200px]"
            controls
            poster={`${url}#t=0.1`}
          >
            <source src={url} type={type} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={url} 
            alt={name || 'Media'} 
            className="w-full h-full object-cover rounded-lg max-h-[200px]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              setError('Failed to load image');
            }}
          />
        )}
      </div>
      
      {!isVideo && (
        <ImageViewer
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
          url={url}
        />
      )}
    </>
  );
};