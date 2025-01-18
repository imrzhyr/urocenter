import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/') && 
        !file.type.startsWith('audio/') && 
        !file.type.startsWith('video/')) {
      throw new Error('Only images, audio, and video files are supported');
    }

    console.log('Original file type:', file.type);
    console.log('Original file name:', file.name);

    // Generate a unique file name while preserving the extension
    const fileExt = file.name.split('.').pop() || '';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Upload with explicit content type and cacheControl
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

    return {
      url: publicUrlData.publicUrl,
      name: file.name,
      type: file.type,
    };
  } catch (error) {
    console.error('Error uploading file:', error);

    if (error.message === 'Only images, audio, and video files are supported') {
      toast.error('Unsupported file type. Only images, audio, and video files are allowed.');
    } else {
      toast.error('Failed to upload file. Please try again.');
    }

    throw error;
  }
};