import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL using the correct method
    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(fileName);

    // Verify the file is accessible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('File not accessible');
      }
    } catch (error) {
      console.error('File accessibility check failed:', error);
      throw new Error('Uploaded file is not accessible');
    }

    return {
      url: publicUrl,
      name: file.name,
      type: file.type
    };
  } catch (error) {
    console.error('File upload error:', error);
    toast.error('Failed to upload file');
    throw error;
  }
};