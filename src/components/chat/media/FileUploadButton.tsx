import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from '@/utils/fileUpload';
import { logger } from '@/utils/logger';

interface FileUploadButtonProps {
  onFileSelect: (fileInfo: { url: string; name: string; type: string }) => void;
  isLoading?: boolean;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      logger.info('FileUpload', 'No file selected');
      return;
    }

    // Log file selection
    logger.info('FileUpload', 'File selected', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      const fileInfo = await uploadFile(file);
      logger.info('FileUpload', 'File info received', fileInfo);
      onFileSelect(fileInfo);
      toast.success('File uploaded successfully');
    } catch (error) {
      logger.error('FileUpload', 'File upload error:', error);
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