import { supabase } from "@/integrations/supabase/client";

export const uploadFile = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${crypto.randomUUID()}.${fileExt}`;

  const { data, error: uploadError } = await supabase.storage
    .from('chat_attachments')
    .upload(filePath, file);

  if (uploadError) {
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