import { supabase } from "@/integrations/supabase/client";

export const uploadFile = async (file: File) => {
  try {
    // Generate a unique file path
    const fileExt = file.type.startsWith('audio/') 
      ? 'webm'  // Always use webm for audio files
      : file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Upload file to Supabase storage with CORS headers
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      throw error;
    }

    // Get the public URL with CORS headers
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