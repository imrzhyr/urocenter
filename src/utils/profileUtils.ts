import { supabase } from '@/integrations/supabase/client';

export const verifyProfile = async (profileId: string): Promise<boolean> => {
  console.log('[ProfileUtils] Verifying profile:', profileId);
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', profileId)
      .single();

    if (error) {
      console.error('[ProfileUtils] Error verifying profile:', error);
      return false;
    }

    console.log('[ProfileUtils] Profile verification result:', data);
    return !!data;
  } catch (error) {
    console.error('[ProfileUtils] Unexpected error in profile verification:', error);
    return false;
  }
};