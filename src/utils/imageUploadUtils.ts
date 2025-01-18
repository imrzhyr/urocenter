import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadImage as uploadToStorage } from '../api/StorageFileApi';

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

    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(`public/${file.name}`, file, {
        contentType: file.type, // Ensure the correct content type is set
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    toast.error(error.message || 'Failed to upload image. Please try again.');
    throw error;
  }
};

async function handleFileSelect(event: Event) {
    // ...existing code...
    try {
        const response = await uploadToStorage(file);
        console.log('Image uploaded successfully:', response);
    } catch (error) {
        console.error('Image upload error:', error);
    }
    // ...existing code...
}