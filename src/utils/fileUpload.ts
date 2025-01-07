import { supabase } from "@/integrations/supabase/client";

export const uploadFile = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${crypto.randomUUID()}.${fileExt}`;

  // Get the current session to ensure we're authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }

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
};