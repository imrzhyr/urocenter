import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    console.log('Starting file upload:', file);
    console.log('File type:', file.type);

    if (!file) {
      throw new Error('No file provided');
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Explicitly set the correct content type based on file extension
    const contentType = file.type;
    console.log('Setting content type:', contentType);

    // Upload directly to raw_uploads bucket with explicit content type
    const { data, error } = await supabase.storage
      .from('raw_uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        contentType: contentType,
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