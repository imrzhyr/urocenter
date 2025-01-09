import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const userPhone = localStorage.getItem('userPhone');
      
      if (!userPhone) {
        toast.error("Please sign in to access the chat");
        navigate("/signin", { replace: true });
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', userPhone)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          throw error;
        }

        if (!profile) {
          localStorage.removeItem('userPhone');
          toast.error("Please sign in to access the chat");
          navigate("/signin", { replace: true });
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        toast.error("An error occurred while checking authentication");
        navigate("/signin", { replace: true });
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('userPhone');
        navigate("/signin", { replace: true });
      } else if (event === 'SIGNED_IN') {
        const userPhone = localStorage.getItem('userPhone');
        if (userPhone) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('phone', userPhone)
            .maybeSingle();
          
          if (profile) {
            navigate("/dashboard");
          }
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
};