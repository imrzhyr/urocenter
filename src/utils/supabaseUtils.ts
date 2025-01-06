import { supabase } from "@/integrations/supabase/client";

export const initializeUserContext = async () => {
  const userPhone = localStorage.getItem('userPhone');
  if (!userPhone) return;

  try {
    // Set an anonymous session
    await supabase.auth.setSession({
      access_token: '',
      refresh_token: '',
    });
    
    // Set the user.phone setting in PostgreSQL
    const { error } = await supabase.rpc('set_user_context', {
      user_phone: userPhone
    });

    if (error) {
      console.error('Error setting user context:', error);
    }
  } catch (error) {
    console.error('Error initializing user context:', error);
  }
};