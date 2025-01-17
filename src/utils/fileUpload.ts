import { supabase } from "@/integrations/supabase/client";
import { logger } from "./logger";

export const uploadFile = async (file: File) => {
  try {
    // Generate a unique file path
    const fileExt = file.type.startsWith('audio/') 
      ? 'mp3'  // Always use mp3 for audio files
      : file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    logger.info('FileUpload', 'Uploading file', {
      originalName: file.name,
      type: file.type,
      size: file.size,
      filePath
    });

    // Upload file to Supabase storage with proper content type
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600'
      });

    if (error) {
      logger.error('FileUpload', 'Upload error', error);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(filePath);

    logger.info('FileUpload', 'Upload successful', {
      publicUrl,
      filePath
    });

    return {
      url: publicUrl,
      name: file.name,
      type: file.type
    };
  } catch (error) {
    logger.error('FileUpload', 'Error uploading file:', error);
    throw error;
  }
};