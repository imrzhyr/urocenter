import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from '@/utils/fileUpload';

interface FileUploadButtonProps {
  onFileSelect: (fileInfo: { url: string; name: string; type: string }) => void;
  isLoading?: boolean;
}

// Define allowed MIME types
const ALLOWED_MIME_TYPES = {
  // Images
  'image/jpeg': true,
  'image/png': true,
  'image/gif': true,
  'image/webp': true,
  // Audio
  'audio/mpeg': true,
  'audio/wav': true,
  'audio/ogg': true,
  'audio/webm': true,
};

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const validateFileType = (file: File): boolean => {
    if (!ALLOWED_MIME_TYPES[file.type as keyof typeof ALLOWED_MIME_TYPES]) {
      toast.error('Only image and audio files are allowed');
      return false;
    }
    return true;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Selected file type:', file.type);

    if (!validateFileType(file)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      const fileInfo = await uploadFile(file);
      onFileSelect(fileInfo);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,audio/*"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={handleClick}
        disabled={isLoading}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
    </>
  );
};