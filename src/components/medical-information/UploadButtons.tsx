import { Button } from "@/components/ui/button";
import { Camera, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
      <Button 
        variant="outline" 
        className="flex-1 w-full sm:w-auto items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
        onClick={onCameraCapture}
        disabled={isUploading}
      >
        <Camera className="w-4 h-4" />
        <span>{t("take_picture")}</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex-1 w-full sm:w-auto items-center justify-center gap-2 bg-secondary/5 hover:bg-secondary/10 text-secondary border-secondary/20"
        onClick={onFileSelect}
        disabled={isUploading}
      >
        <FileText className="w-4 h-4" />
        <span>{t("upload_files")}</span>
      </Button>
    </div>
  );
};