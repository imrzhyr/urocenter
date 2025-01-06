import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "./fileUpload";
import { toast } from "sonner";

export const sendMessage = async (
  message: string,
  selectedFile: File | null,
  onSuccess: () => void
) => {
  try {
    const userPhone = localStorage.getItem('userPhone');
    
    if (!userPhone) {
      throw new Error('Please sign in to send messages');
    }

    // First set the user context
    const { error: contextError } = await supabase.rpc('set_user_context', {
      user_phone: userPhone
    });

    if (contextError) {
      console.error('Error setting user context:', contextError);
      throw new Error('Could not verify user context');
    }

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', userPhone)
      .maybeSingle();

    if (profileError || !profile?.id) {
      console.error('Error fetching profile:', profileError);
      throw new Error('Could not verify user profile');
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

    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        content: message.trim(),
        is_from_doctor: false,
        user_id: profile.id,
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_type: fileData?.type
      });

    if (insertError) {
      console.error('Error inserting message:', insertError);
      throw new Error('Failed to send message');
    }

    onSuccess();
    
  } catch (error: any) {
    console.error('Error sending message:', error);
    toast.error(error.message || 'Failed to send message');
    throw error;
  }
};