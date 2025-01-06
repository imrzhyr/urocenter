import { supabase } from "@/integrations/supabase/client";

export const setMessageContext = async (userPhone: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('set_user_context', { 
      user_phone: userPhone 
    });
    
    if (error) {
      console.error('Error setting user context:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in setMessageContext:', error);
    return false;
  }
};

export const getUserProfile = async (userPhone: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('phone', userPhone)
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};