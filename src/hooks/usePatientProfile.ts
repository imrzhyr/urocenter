import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePatientProfile = (patientId: string) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['patient-profile', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!patientId,
  });

  return { profile, isLoading };
};