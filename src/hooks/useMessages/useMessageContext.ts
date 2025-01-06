import { supabase } from '@/integrations/supabase/client';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const setMessageContext = async (userPhone: string, retryCount = 0): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('set_user_context', { 
      user_phone: userPhone 
    });
    
    if (error) {
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        return setMessageContext(userPhone, retryCount + 1);
      }
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
      .maybeSingle();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};