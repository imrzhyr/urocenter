import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    // MIME type fallback dictionary
    const mimeTypes = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      mp4: 'video/mp4',
      webm: 'video/webm',
      mp3: 'audio/mpeg',
    };

    // Determine MIME type
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const mimeType = mimeTypes[extension as keyof typeof mimeTypes] || file.type || 'application/octet-stream';

    // Validate file type for images, audio, and video files
    if (!mimeType.startsWith('image/') && 
        !mimeType.startsWith('audio/') && 
        !mimeType.startsWith('video/')) {
      throw new Error('Only images, audio, and video files are supported');
    }

    console.log('File type:', file.type, 'Mime type:', mimeType);

    // Generate a unique file name
    const fileName = `${crypto.randomUUID()}-${file.name}`;

    // Ensure MIME type is explicitly passed
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(fileName, file, {
        contentType: mimeType, // Explicitly set the MIME type
      });

    if (error) {
      throw error;
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(fileName);

    // Return the file's public URL, name, and type
    return {
      url: publicUrlData.publicUrl,
      name: file.name,
      type: mimeType,
    };
  } catch (error) {
    console.error('Error uploading file:', error);

    // Display an error message
    if (error.message === 'Only images, audio, and video files are supported') {
      toast.error('Unsupported file type. Only images, audio, and video files are allowed.');
    } else {
      toast.error('Failed to upload file. Please try again.');
    }

    throw error;
  }
};