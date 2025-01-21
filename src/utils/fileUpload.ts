import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from '@/utils/logger';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB for multiple files

export const validateFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  if (!file.type.match(/^(image|audio|video)\//)) {
    throw new Error('Only images, audio, and video files are supported');
  }
};

export const validateFiles = (files: File[]) => {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_TOTAL_SIZE) {
    throw new Error('Total file size exceeds 50MB limit');
  }

  files.forEach(validateFile);
};

export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  try {
    validateFile(file);

    // Log the original file details
    logger.info('FileUpload', 'Starting file upload', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Create a unique file name
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    logger.info('FileUpload', 'Uploading file', {
      fileName,
      contentType: file.type
    });

    // Convert file to ArrayBuffer and then to Uint8Array for binary upload
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      logger.error('FileUpload', 'Upload error:', error);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(fileName);

    logger.info('FileUpload', 'Upload successful', {
      url: publicUrl,
      name: file.name,
      type: file.type
    });

    return {
      url: publicUrl,
      name: file.name,
      type: file.type
    };
  } catch (error) {
    logger.error('FileUpload', 'Error in uploadFile:', error);
    toast.error('Failed to upload file');
    throw error;
  }
};

export const uploadFiles = async (files: File[], onProgress?: (progress: number) => void) => {
  try {
    validateFiles(files);

    const totalFiles = files.length;
    let completedFiles = 0;

    const uploadPromises = files.map(async (file) => {
      const result = await uploadFile(file);
      completedFiles++;
      onProgress?.(completedFiles / totalFiles);
      return result;
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    logger.error('FileUpload', 'Error in uploadFiles:', error);
    toast.error('Failed to upload files');
    throw error;
  }
};