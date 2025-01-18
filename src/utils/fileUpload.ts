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

    // Generate a unique file name
    const fileName = `${crypto.randomUUID()}-${file.name}`;

    // Upload with original MIME type
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(fileName, file, {
        contentType: file.type, // Use original MIME type
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(fileName);

    return {
      url: publicUrlData.publicUrl,
      name: file.name,
      type: file.type, // Use original MIME type
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