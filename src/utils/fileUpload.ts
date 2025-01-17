import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Handle WebM audio files specifically
    let uploadFile = file;
    if (file.type.includes('webm')) {
      const audioBlob = new Blob([await file.arrayBuffer()], { 
        type: 'audio/webm' 
      });
      uploadFile = new File([audioBlob], file.name, { 
        type: 'audio/webm'
      });
    }

    // For images, ensure proper MIME type
    if (file.type.startsWith('image/')) {
      const imageBlob = new Blob([await file.arrayBuffer()], { 
        type: file.type 
      });
      uploadFile = new File([imageBlob], file.name, { 
        type: file.type
      });
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
      toast.error('Failed to upload file');
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