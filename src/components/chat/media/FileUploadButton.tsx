import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/utils/fileUpload";

interface FileUploadButtonProps {
  onFileUpload: (fileInfo: { url: string; name: string; type: string }) => void;
}

export const FileUploadButton = ({ onFileUpload }: FileUploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Selected file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      setIsUploading(true);
      // Create a new File object with explicit type
      const fileWithType = new File([file], file.name, {
        type: file.type
      });
      
      const uploadedFile = await uploadFile(fileWithType);
      onFileUpload(uploadedFile);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
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
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/ogg,audio/webm"
        className="hidden"
      />
      {isUploading ? (
        <Button disabled variant="ghost" size="icon" className="h-10 w-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      ) : (
        <Button
          onClick={() => fileInputRef.current?.click()}
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