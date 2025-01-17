import { supabase } from "@/integrations/supabase/client";

export const ensureChatAttachmentsBucket = async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(bucket => bucket.name === 'chat_attachments')) {
    await supabase.storage.createBucket('chat_attachments', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/*', 'video/*', 'audio/*']
    });
  }
};