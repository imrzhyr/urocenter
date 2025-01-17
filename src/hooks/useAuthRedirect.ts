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

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', userPhone)
        .maybeSingle();

      if (!profile) {
        localStorage.removeItem('userPhone');
        toast.error("Please sign in to access the chat");
        navigate("/signin", { replace: true });
        return;
      }

      // Check if user is unpaid and redirect to payment page
      if (profile.payment_status !== 'paid' || profile.payment_approval_status !== 'approved') {
        navigate("/payment", { replace: true });
        return;
      }
    };

    checkAuth();
  }, [navigate]);
};