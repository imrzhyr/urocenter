import React from 'react';

interface MediaGalleryProps {
  url: string;
  type: string;
  name: string;
}

export const MediaGallery = ({ url, type, name }: MediaGalleryProps) => {
  const isVideo = type?.startsWith('video/');

  return (
    <div className="relative rounded-lg overflow-hidden max-w-[120px]">
      {isVideo ? (
        <>
          <video 
            className="w-full h-full object-cover max-h-[120px]"
            controls
            poster={`${url}#t=0.1`}
          >
            <source src={url} type={type} />
            Your browser does not support the video tag.
          </video>
        </>
      ) : (
        <img 
          src={url} 
          alt={name || 'Media'} 
          className="w-full h-full object-cover max-h-[120px]"
        />
      )}
    </div>
  );
};