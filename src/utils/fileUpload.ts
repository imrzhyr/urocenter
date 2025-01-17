import { supabase } from "@/integrations/supabase/client";
import { logger } from "./logger";

export const uploadFile = async (file: File) => {
  try {
    // Generate a unique file path
    const fileExt = file.type.startsWith('audio/') 
      ? 'mp3'  // Always use mp3 extension for audio files
      : file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    logger.info('FileUpload', 'Uploading file', {
      originalName: file.name,
      type: file.type,
      size: file.size,
      filePath
    });

    // For audio files, ensure we're using the correct MIME type and format
    let contentType = file.type;
    let fileToUpload = file;

    if (file.type.startsWith('audio/')) {
      // Convert audio to proper format
      const audioBuffer = await file.arrayBuffer();
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      
      // Create a new File object from the Blob with proper metadata
      fileToUpload = new File([blob], file.name, {
        type: 'audio/mpeg',
        lastModified: file.lastModified
      });
      contentType = 'audio/mpeg';
      
      logger.info('FileUpload', 'Converted audio file', {
        originalType: file.type,
        newType: contentType,
        size: fileToUpload.size
      });
    }

    // Upload file to Supabase storage with proper content type
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, fileToUpload.slice(), {
        contentType: contentType,
        upsert: false,
        cacheControl: '3600'
      });

    if (error) {
      logger.error('FileUpload', 'Error uploading file:', error);
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
      type: file.type.startsWith('audio/') ? 'audio/mpeg' : file.type
    };
  } catch (error) {
    logger.error('FileUpload', 'Error uploading file:', error);
    throw error;
  }
};