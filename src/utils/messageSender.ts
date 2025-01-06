import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "./fileUpload";
import { toast } from "sonner";

export const sendMessage = async (
  message: string,
  selectedFile: File | null,
  onSuccess: () => void
) => {
  const userPhone = localStorage.getItem('userPhone');
  if (!userPhone) {
    throw new Error('Please sign in to send messages');
  }

  try {
    // Set up user context first
    const { error: contextError } = await supabase.rpc('set_user_context', {
      user_phone: userPhone
    });

    if (contextError) {
      console.error('Context error:', contextError);
      throw contextError;
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', userPhone)
      .maybeSingle();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error('Could not verify user profile');
    }

    if (!profile?.id) {
      throw new Error('User profile not found');
    }

    // Handle file upload if present
    let fileData = null;
    if (selectedFile) {
      fileData = await uploadFile(selectedFile);
    }

    // Send message with the correct user_id
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
      console.error('Insert error:', insertError);
      throw insertError;
    }

    console.log('Message sent successfully');
    onSuccess();
  } catch (error: any) {
    console.error('Error sending message:', error);
    toast.error(error.message || 'Failed to send message');
    throw error;
  }
};