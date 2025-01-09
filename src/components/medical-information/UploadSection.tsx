import { UploadButtons } from "./UploadButtons";

interface UploadSectionProps {
  onCameraCapture: () => void;
  onFileSelect: () => void;
  isUploading: boolean;
}

export const UploadSection = ({
  onCameraCapture,
  onFileSelect,
  isUploading,
}: UploadSectionProps) => {
  return (
    <div className="mt-6">
      <UploadButtons
        onCameraCapture={onCameraCapture}
        onFileSelect={onFileSelect}
        isUploading={isUploading}
      />
    </div>
  );
};