import { useState } from "react";
import { ImageViewer } from "./ImageViewer";
import { cn } from "@/lib/utils";

interface MediaGalleryProps {
  fileUrl?: string | null;
  fileType?: string | null;
  fileName?: string | null;
  messageId?: string;
  className?: string;
}

export const MediaGallery = ({ 
  fileUrl, 
  fileType, 
  fileName,
  className 
}: MediaGalleryProps) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  if (!fileUrl || !fileType) return null;

  const isImage = fileType.startsWith('image/');
  const isVideo = fileType.startsWith('video/');

  return (
    <div className={cn("relative", className)}>
      {isImage && (
        <>
          <div 
            className="relative max-w-[200px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsImageViewerOpen(true)}
          >
            <img
              src={fileUrl}
              alt={fileName || 'Image'}
              className="w-full h-auto object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          <ImageViewer
            isOpen={isImageViewerOpen}
            onClose={() => setIsImageViewerOpen(false)}
            url={fileUrl}
            name={fileName || ''}
          />
        </>
      )}
      {isVideo && (
        <div className="max-w-[200px] rounded-lg overflow-hidden">
          <video
            src={fileUrl}
            controls
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
};