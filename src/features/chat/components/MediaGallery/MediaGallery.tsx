import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageViewer } from '@/components/chat/media/ImageViewer';

interface MediaGalleryProps {
  url: string;
  type: string;
  name: string;
}

export const MediaGallery = ({ url, type, name }: MediaGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (type.startsWith('image/')) {
    return (
      <>
        <img
          src={url}
          alt={name}
          className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsOpen(true)}
        />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl">
            <ImageViewer 
              url={url} 
              isOpen={isOpen} 
              onClose={() => setIsOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (type.startsWith('video/')) {
    return (
      <video
        src={url}
        controls
        className="max-w-full rounded-lg"
      />
    );
  }

  return null;
};