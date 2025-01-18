import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    // Get the file extension and convert to lowercase
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    // Use the file's actual MIME type instead of trying to determine it
    const mimeType = file.type;

    // Validate mime type
    if (!mimeType.startsWith('image/') && 
        !mimeType.startsWith('audio/') && 
        !mimeType.startsWith('video/')) {
      throw new Error('Unsupported file type');
    }

    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

    // Upload the file directly with its original MIME type
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      name: file.name,
      type: mimeType
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    throw error;
  }
};