import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'audio/mpeg',
  'audio/ogg',
  'audio/webm'
];

export const uploadFile = async (file: File) => {
  try {
    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(`Unsupported file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
    }

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Generate unique filename while preserving extension
    const fileName = `${crypto.randomUUID()}-${file.name}`;

    // Upload file with explicit content type
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(fileName);

    console.log('Upload successful:', {
      fileName,
      contentType: file.type,
      url: publicUrlData.publicUrl
    });

    return {
      url: publicUrlData.publicUrl,
      name: file.name,
      type: file.type,
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    toast.error(error.message || 'Failed to upload file. Please try again.');
    throw error;
  }
};