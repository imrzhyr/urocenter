import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Image, FileVideo, Loader2 } from "lucide-react";
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

    try {
      setIsUploading(true);
      const uploadedFile = await uploadFile(file);
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
        accept="image/*,video/*"
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
          <div className="relative">
            <Image className="h-5 w-5 text-primary absolute -left-3" />
            <FileVideo className="h-5 w-5 text-primary absolute left-0" />
          </div>
        </Button>
      )}
    </div>
  );
};