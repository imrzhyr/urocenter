import { supabase } from "@/integrations/supabase/client";

export const uploadFile = async (file: File) => {
  try {
    // Generate a unique file path
    const fileExt = file.type.startsWith('audio/') 
      ? file.type.split('/')[1].split(';')[0]  // Get the audio format (webm, mp4, etc.)
      : file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      name: file.name,
      type: file.type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};