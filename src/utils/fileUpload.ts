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

    // Handle WebM audio files
    let uploadFile = file;
    if (file.type.includes('webm')) {
      const blob = new Blob([await file.arrayBuffer()], { 
        type: 'audio/webm' 
      });
      uploadFile = new File([blob], file.name, { 
        type: 'audio/webm'
      });
    }

    console.log('Uploading file with content type:', uploadFile.type);

    // Upload file to Supabase storage
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

    // Get the public URL for the uploaded file
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