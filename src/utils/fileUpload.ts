import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from '@/utils/logger';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  if (!file.type.match(/^(image|audio|video)\//)) {
    throw new Error('Only images, audio, and video files are supported');
  }
};

export const uploadFile = async (file: File) => {
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