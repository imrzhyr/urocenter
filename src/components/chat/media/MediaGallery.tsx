import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Message } from "@/types/profile";
import { Play } from "lucide-react";

interface MediaGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
  onSelectMedia: (url: string) => void;
}

export const MediaGallery = ({ open, onOpenChange, messages, onSelectMedia }: MediaGalleryProps) => {
  const mediaMessages = messages.filter(m => 
    m.file_url && (
      m.file_type?.startsWith('image/') || 
      m.file_type?.startsWith('video/') ||
      m.file_type?.startsWith('audio/')
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">Media Gallery</h2>
        <div className="grid grid-cols-3 gap-4">
          {mediaMessages.map((message) => (
            <div 
              key={message.id}
              className="aspect-square cursor-pointer rounded-lg overflow-hidden relative group"
              onClick={() => onSelectMedia(message.file_url!)}
            >
              {message.file_type?.startsWith('video/') ? (
                <>
                  <video 
                    className="w-full h-full object-cover"
                    poster={`${message.file_url}#t=0.1`}
                  >
                    <source src={message.file_url} type={message.file_type} />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </>
              ) : message.file_type?.startsWith('audio/') ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-sm text-gray-500">
                    Voice Message
                    {message.duration && (
                      <span className="block text-xs">
                        {Math.floor(message.duration / 60)}:{(message.duration % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <img 
                  src={message.file_url!} 
                  alt={message.file_name || 'Media'} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};