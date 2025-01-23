import { Message } from "@/types/profile";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MessageStatus } from "../MessageStatus";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface PhotoMessageProps {
  message: Message;
  urls?: string[];
  fileNames?: string[];
  content?: string;
  timestamp?: Date;
  fromCurrentUser?: boolean;
  showStatus?: boolean;
}

export const PhotoMessage = ({ 
  message,
  urls,
  fileNames,
  content,
  timestamp,
  fromCurrentUser,
  showStatus 
}: PhotoMessageProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {urls?.map((url, index) => (
          <div
            key={url}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => handleImageClick(url)}
          >
            <img
              src={url}
              alt={fileNames?.[index] || 'Image'}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ))}
      </div>

      {content && (
        <p className="text-sm">{content}</p>
      )}

      <div className={cn(
        "flex items-center gap-1.5",
        "text-[11px]",
        fromCurrentUser ? "justify-end" : "justify-start"
      )}>
        <span className={cn(
          fromCurrentUser ? "text-white/80" : "text-gray-500"
        )}>
          {format(timestamp || new Date(message.created_at), 'h:mm a')}
        </span>
        {showStatus && fromCurrentUser && <MessageStatus message={message} />}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none">
          {selectedImage && (
            <div className="relative w-full aspect-auto">
              <img
                src={selectedImage}
                alt="Full size image"
                className="w-full h-full object-contain"
                onClick={handleCloseDialog}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};