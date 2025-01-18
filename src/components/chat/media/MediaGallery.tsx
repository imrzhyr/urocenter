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
          <img
            src={fileUrl}
            alt={fileName || 'Image'}
            className="max-w-[200px] w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsImageViewerOpen(true)}
            loading="lazy"
          />
          <ImageViewer
            isOpen={isImageViewerOpen}
            onClose={() => setIsImageViewerOpen(false)}
            url={fileUrl}
            name={fileName || ''}
          />
        </>
      )}
      {isVideo && (
        <video
          src={fileUrl}
          controls
          className="max-w-[200px] w-full h-auto rounded-lg"
        />
      )}
    </div>
  );
};