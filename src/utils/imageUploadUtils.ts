import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

export const uploadImage = async (file: File) => {
  try {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Unsupported image type. Please upload a JPG, PNG, WebP, GIF, or SVG file.');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size too large. Please upload an image smaller than 5MB.');
    }

    const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

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

    const { data: publicUrlData } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(fileName);

    return {
      url: publicUrlData.publicUrl,
      name: file.name,
      type: file.type
    };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    toast.error(error.message || 'Failed to upload image. Please try again.');
    throw error;
  }
};