import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Create a new File object with the correct MIME type
    let uploadFile: File;
    
    // Handle WebM audio files specifically
    if (file.type.includes('webm')) {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/webm' });
      uploadFile = new File([blob], file.name, { type: 'audio/webm' });
    } 
    // Handle images specifically
    else if (file.type.startsWith('image/')) {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      uploadFile = new File([blob], file.name, { type: file.type });
    } 
    // Handle other file types
    else {
      uploadFile = file;
    }

    console.log('Uploading file with type:', uploadFile.type);

    // Upload file to Supabase storage with explicit content type
    const { data, error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, uploadFile, {
        contentType: uploadFile.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      name: file.name,
      type: uploadFile.type
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};