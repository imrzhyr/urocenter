import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatStatus = (patientId: string) => {
  const { data: chatStatus = false } = useQuery({
    queryKey: ['chat-status', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('is_resolved')
        .eq('user_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) return false;
      return data?.is_resolved || false;
    },
    enabled: !!patientId,
  });

  return { chatStatus };
};