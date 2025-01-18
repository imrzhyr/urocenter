import { useState } from "react";
import { ImageViewer } from "./ImageViewer";
import { AudioPlayer } from "../audio/AudioPlayer";
import { cn } from "@/lib/utils";

interface MediaGalleryProps {
  fileUrl?: string | null;
  fileType?: string | null;
  fileName?: string | null;
  duration?: number | null;
  className?: string;
}

export const MediaGallery = ({ fileUrl, fileType, fileName, duration, className }: MediaGalleryProps) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  console.log('MediaGallery props:', { fileUrl, fileType, fileName, duration });

  if (!fileUrl || !fileType) return null;

  const isImage = fileType.startsWith('image/');
  const isAudio = fileType.startsWith('audio/');
  const isVideo = fileType.startsWith('video/');

  return (
    <div className={cn("relative", className)}>
      {isImage && (
        <>
          <div className="relative max-w-[300px] rounded-lg overflow-hidden">
            <img
              src={fileUrl}
              alt={fileName || 'Image'}
              className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setIsImageViewerOpen(true)}
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
        <div className="max-w-[300px] rounded-lg overflow-hidden">
          <video
            src={fileUrl}
            controls
            className="w-full h-auto"
          />
        </div>
      )}
      {isAudio && (
        <AudioPlayer
          url={fileUrl}
          duration={duration}
          className="w-[200px]"
        />
      )}
    </div>
  );
};