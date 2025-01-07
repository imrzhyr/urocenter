import { supabase } from "@/integrations/supabase/client";

export const uploadFile = async (file: File) => {
  const userPhone = localStorage.getItem('userPhone');
  if (!userPhone) {
    throw new Error('Authentication required');
  }

  try {
    // Set user context before upload and wait for it to complete
    const { error: contextError } = await supabase.rpc('set_user_context', { 
      user_phone: userPhone 
    });

    if (contextError) {
      console.error('Context error:', contextError);
      throw contextError;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Upload file after context is set
    const { data, error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

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