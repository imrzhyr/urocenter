import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    // Simple validation for image and audio files
    if (!file.type.startsWith('image/') && 
        !file.type.startsWith('audio/') && 
        !file.type.startsWith('video/')) {
      throw new Error('Only images, audio, and video files are supported');
    }

    const fileName = `${crypto.randomUUID()}-${file.name}`;

    // Upload file directly without any conversion
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(fileName, file, {
        contentType: file.type // Use the file's original MIME type
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      name: file.name,
      type: file.type // Use the original file type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    throw error;
  }
};