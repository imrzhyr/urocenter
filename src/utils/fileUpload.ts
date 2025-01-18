import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    // Determine correct MIME type based on file extension
    let mimeType = file.type;
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    // Handle common image formats
    if (fileExt === 'jpg' || fileExt === 'jpeg') {
      mimeType = 'image/jpeg';
    } else if (fileExt === 'png') {
      mimeType = 'image/png';
    } else if (fileExt === 'gif') {
      mimeType = 'image/gif';
    } else if (fileExt === 'webp') {
      mimeType = 'image/webp';
    }
    // Handle audio formats
    else if (fileExt === 'webm') {
      mimeType = 'audio/webm';
    } else if (fileExt === 'mp3') {
      mimeType = 'audio/mpeg';
    } else if (fileExt === 'wav') {
      mimeType = 'audio/wav';
    }
    // Handle video formats
    else if (fileExt === 'mp4') {
      mimeType = 'video/mp4';
    }

    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

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
      type: mimeType // Use the corrected MIME type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    throw error;
  }
};