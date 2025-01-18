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

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Generate unique filename while preserving extension
    const fileExt = file.name.split('.').pop() || '';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Upload directly with proper content type
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(fileName, file, {
        contentType: file.type, // Explicitly set the content type
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