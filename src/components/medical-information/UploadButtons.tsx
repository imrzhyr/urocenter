import { Button } from "@/components/ui/button";
import { Camera, FileText } from "lucide-react";

interface UploadButtonsProps {
  onCameraCapture: () => void;
  onFileSelect: () => void;
  isUploading: boolean;
}

export const UploadButtons = ({
  onCameraCapture,
  onFileSelect,
  isUploading
}: UploadButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
        onClick={onCameraCapture}
        disabled={isUploading}
      >
        <Camera className="w-4 h-4" />
        <span>Take Picture</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 bg-secondary/5 hover:bg-secondary/10 text-secondary border-secondary/20"
        onClick={onFileSelect}
        disabled={isUploading}
      >
        <FileText className="w-4 h-4" />
        <span>Upload Files</span>
      </Button>
    </div>
  );
};