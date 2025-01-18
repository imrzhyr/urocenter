import { useState } from 'react';
import { ImageViewer } from './ImageViewer';

interface MediaGalleryProps {
  url: string;
  type: string;
  name: string;
}

export const MediaGallery = ({ url, type, name }: MediaGalleryProps) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const isVideo = type?.startsWith('video/');

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