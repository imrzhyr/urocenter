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

  if (!fileUrl || !fileType) return null;

  const isImage = fileType.startsWith('image/');
  const isAudio = fileType.startsWith('audio/');
  const isVideo = fileType.startsWith('video/');

  return (
    <div className={cn("relative", className)}>
      {isImage && (
        <>
          <img
            src={fileUrl}
            alt={fileName || 'Image'}
            className="max-w-[200px] max-h-[200px] rounded-lg cursor-pointer object-cover"
            onClick={() => setIsImageViewerOpen(true)}
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
          className="max-w-[200px] max-h-[200px] rounded-lg"
        />
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