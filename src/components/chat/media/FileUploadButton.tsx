import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from '@/utils/fileUpload';

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
    if (!file) return;

    console.log('Selected file:', file);

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
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
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