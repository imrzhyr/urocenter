import { supabase } from '@/integrations/supabase/client';

export const verifyProfile = async (profileId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', profileId)
    .single();

  if (error) {
    console.error('Error verifying profile:', error);
    return false;
  }

  return !!data;
};