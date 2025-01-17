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

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', userPhone)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

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

      // If we're already on the dashboard, don't redirect
      if (window.location.pathname === '/dashboard') {
        return;
      }

      // If user is paid and approved, redirect to dashboard
      if (profile.payment_status === 'paid' && profile.payment_approval_status === 'approved') {
        navigate("/dashboard", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);
};