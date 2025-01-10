import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Message } from "@/types/profile";
import { Play } from "lucide-react";

interface MediaGalleryProps {
  url: string;
  type: string;
  name: string;
}

export const MediaGallery = ({ url, type, name }: MediaGalleryProps) => {
  const isVideo = type?.startsWith('video/');

  return (
    <div className="relative rounded-lg overflow-hidden">
      {isVideo ? (
        <>
          <video 
            className="w-full h-full object-cover"
            controls
            poster={`${url}#t=0.1`}
          >
            <source src={url} type={type} />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors pointer-events-none">
            <Play className="w-12 h-12 text-white" />
          </div>
        </>
      ) : (
        <img 
          src={url} 
          alt={name || 'Media'} 
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};