import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  const userPhone = localStorage.getItem('userPhone');
  if (!userPhone) {
    throw new Error('Authentication required');
  }

  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Handle WebM audio files specifically
    let contentType = file.type;
    if (file.type.includes('audio/webm')) {
      contentType = 'audio/webm';
    }

    console.log('Uploading file with content type:', contentType);

    // Upload file to Supabase storage with explicit content type
    const { data, error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file, {
        contentType,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Failed to upload file');
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      name: file.name,
      type: contentType
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};