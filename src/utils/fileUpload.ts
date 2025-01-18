import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from '@/utils/logger';

export const uploadFile = async (file: File) => {
  try {
    // Log the original file details
    logger.info('FileUpload', 'Starting file upload', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!file.type.startsWith('image/') && 
        !file.type.startsWith('audio/') && 
        !file.type.startsWith('video/')) {
      throw new Error('Only images, audio, and video files are supported');
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    logger.info('FileUpload', 'Uploading file', {
      fileName,
      contentType: file.type
    });

    // Upload file with explicit content type
    const { data, error } = await supabase.storage
      .from('medical_reports')
      .upload(fileName, file, {
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
      .from('medical_reports')
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