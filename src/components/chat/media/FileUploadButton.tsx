import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

interface FileUploadButtonProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadButton = ({ onFileUpload }: FileUploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    try {
      await onFileUpload(e);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/ogg,audio/webm"
        className="hidden"
      />
      {isUploading ? (
        <Button disabled variant="ghost" size="icon" className="h-10 w-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          variant="ghost"
          size="icon"
          className="h-10 w-10"
        >
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
};