import { useState } from "react";
import { ImageViewer } from "./ImageViewer";
import { AudioPlayer } from "../audio/AudioPlayer";
import { cn } from "@/lib/utils";

interface MediaGalleryProps {
  fileUrl?: string | null;
  fileType?: string | null;
  fileName?: string | null;
  duration?: number | null;
  messageId?: string;
  className?: string;
}

export const MediaGallery = ({ 
  fileUrl, 
  fileType, 
  fileName, 
  duration, 
  messageId, 
  className 
}: MediaGalleryProps) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  if (!fileUrl || !fileType) return null;

  const isImage = fileType.startsWith('image/');
  const isAudio = fileType.startsWith('audio/');
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
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            {fileName && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                {fileName}
              </div>
            )}
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
            className="w-full h-auto"
          />
        </div>
      )}
      {isAudio && messageId && (
        <AudioPlayer
          url={fileUrl}
          messageId={messageId}
          duration={duration}
          className="w-[180px]"
        />
      )}
    </div>
  );
};