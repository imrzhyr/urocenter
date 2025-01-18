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

    console.log('Selected file type:', file.type);

    try {
      setIsUploading(true);
      const uploadedFile = await uploadFile(file);
      onFileUpload(uploadedFile);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('File upload error:', error);
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
        accept="image/*,video/*,audio/*"
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