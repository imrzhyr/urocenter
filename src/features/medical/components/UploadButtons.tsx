import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";

interface UploadButtonsProps {
  onCameraCapture: () => void;
  onFileSelect: () => void;
  isUploading: boolean;
}

export const UploadButtons = ({ onCameraCapture, onFileSelect, isUploading }: UploadButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        onClick={onCameraCapture}
        disabled={isUploading}
        className="flex-1"
        variant="outline"
      >
        <Camera className="w-4 h-4 mr-2" />
        Take Photo
      </Button>
      <Button
        onClick={onFileSelect}
        disabled={isUploading}
        className="flex-1"
        variant="outline"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload File
      </Button>
    </div>
  );
};