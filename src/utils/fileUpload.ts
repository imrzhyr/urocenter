import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadFile = async (file: File) => {
  try {
    // Validate file type for images, audio, and video files
    if (!file.type.startsWith('image/') && 
        !file.type.startsWith('audio/') && 
        !file.type.startsWith('video/')) {
      throw new Error('Only images, audio, and video files are supported');
    }

    // Generate a unique file name
    const fileName = `${crypto.randomUUID()}-${file.name}`;

    // Ensure MIME type is explicitly passed
    const { data, error } = await supabase.storage
      .from('chat_attachments')
      .upload(fileName, file, {
        contentType: file.type, // Explicitly set the MIME type
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
      type: file.type,
    };
  } catch (error) {
    console.error('Error uploading file:', error);

    // Display an error message
    if (error.message === 'Invalid file type') {
      toast.error('Unsupported file type. Only images, audio, and video files are allowed.');
    } else {
      toast.error('Failed to upload file. Please try again.');
    }

    throw error;
  }
};