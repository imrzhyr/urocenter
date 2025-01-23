import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

const fetchProfile = async (phone: string | null): Promise<Profile | null> => {
  if (!phone) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const useProfileQuery = (phone: string | null) => {
  return useQuery({
    queryKey: ['profile', phone],
    queryFn: () => fetchProfile(phone),
    enabled: !!phone,
  });
};