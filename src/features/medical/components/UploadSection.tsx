import { UploadButtons } from "./UploadButtons";

interface UploadSectionProps {
  onCameraCapture: () => void;
  onFileSelect: () => void;
  isUploading: boolean;
}

export const UploadSection = ({ onCameraCapture, onFileSelect, isUploading }: UploadSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Upload Documents</h2>
      <UploadButtons
        onCameraCapture={onCameraCapture}
        onFileSelect={onFileSelect}
        isUploading={isUploading}
      />
    </div>
  );
};