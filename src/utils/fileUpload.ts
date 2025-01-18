import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    console.log('Starting file upload:', file);

    if (!file) {
      throw new Error('No file provided');
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload directly to raw_uploads bucket without any transformation
    const { data, error } = await supabase.storage
      .from('raw_uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    console.log('Upload successful:', data);

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('raw_uploads')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      name: file.name,
      type: file.type
    };
  } catch (error: any) {
    console.error('File upload failed:', error);
    toast.error('Failed to upload file');
    throw error;
  }
};