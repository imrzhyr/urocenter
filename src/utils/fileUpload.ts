import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  const userPhone = localStorage.getItem('userPhone');
  if (!userPhone) {
    throw new Error('Authentication required');
  }

  try {
    // Generate a unique file path
    const fileExt = file.type === 'audio/mp3' ? 'mp3' : file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Upload file to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type
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
      type: file.type
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};