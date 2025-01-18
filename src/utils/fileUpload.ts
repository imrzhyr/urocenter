import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "./logger";

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

export const uploadFile = async (file: File) => {
  try {
    // Log file details
    logger.info('FileUpload', 'Starting file upload', {
      name: file.name,
      type: file.type,
      size: file.size,
      isFile: file instanceof File
    });

    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES[file.type as keyof typeof ALLOWED_MIME_TYPES]) {
      logger.warn('FileUpload', 'Invalid file type', { type: file.type });
      throw new Error('Only image and audio files are allowed');
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Log upload configuration
    logger.info('FileUpload', 'Upload configuration', {
      fileName,
      contentType: file.type,
      fileExtension: fileExt
    });

    // Upload file with explicit content type
    const { data, error } = await supabase.storage
      .from('raw_uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (error) {
      logger.error('FileUpload', 'Upload failed', error);
      throw error;
    }

    logger.info('FileUpload', 'Upload successful', { data });

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('raw_uploads')
      .getPublicUrl(fileName);

    // Log final result
    logger.info('FileUpload', 'File processing complete', {
      url: publicUrl,
      name: file.name,
      type: file.type
    });

    return {
      url: publicUrl,
      name: file.name,
      type: file.type
    };
  } catch (error: any) {
    logger.error('FileUpload', 'Error in uploadFile', error);
    toast.error('Failed to upload file');
    throw error;
  }
};