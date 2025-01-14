import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  name?: string; // Added name as optional prop
}

export const ImageViewer = ({ isOpen, onClose, url }: ImageViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <VisuallyHidden>
          <DialogTitle>Image Preview</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full h-full">
          <img
            src={url}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};