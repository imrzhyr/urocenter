import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) {
          toast.error("Please sign in to access the chat");
          navigate("/signin", { replace: true });
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', userPhone)
          .maybeSingle();

        if (!profile) {
          localStorage.removeItem('userPhone');
          toast.error("Please sign in to access the chat");
          navigate("/signin", { replace: true });
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('userPhone');
        navigate("/signin", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isLoading };
};