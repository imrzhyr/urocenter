import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "./fileUpload";
import { toast } from "sonner";

export const sendMessage = async (
  message: string,
  selectedFile: File | null,
  onSuccess: () => void
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Please sign in to send messages');
    }

    let fileData = null;
    if (selectedFile) {
      try {
        fileData = await uploadFile(selectedFile);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
      }
    }

    const messageData = {
      content: message.trim(),
      is_from_doctor: false,
      user_id: session.user.id,
      file_url: fileData?.url,
      file_name: fileData?.name,
      file_type: fileData?.type
    };

    const { error: insertError } = await supabase
      .from('messages')
      .insert(messageData);

    if (insertError) {
      console.error('Error inserting message:', insertError);
      throw new Error('Failed to send message');
    }

    onSuccess();
    
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw error;
  }
};