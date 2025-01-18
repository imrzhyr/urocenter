import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GalleryHorizontal, Loader2 } from "lucide-react";
import { uploadImage } from "@/utils/imageUploadUtils";
import { toast } from "sonner";

interface ImageUploadButtonProps {
  onImageUpload: (fileInfo: { url: string; name: string; type: string }) => void;
  disabled?: boolean;
}

export const ImageUploadButton = ({ onImageUpload, disabled }: ImageUploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadedFile = await uploadImage(file);
      onImageUpload(uploadedFile);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 hover:bg-primary/10 dark:hover:bg-primary/20"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <GalleryHorizontal className="h-5 w-5 text-primary" />
        )}
      </Button>
    </>
  );
};