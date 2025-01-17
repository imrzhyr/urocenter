import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPhoneNumber } from "@/utils/phoneUtils";

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

      // Format the phone number consistently
      const formattedPhone = formatPhoneNumber(userPhone);
      console.log('Checking auth for phone:', formattedPhone);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!profile) {
        console.log('No profile found for phone:', formattedPhone);
        localStorage.removeItem('userPhone');
        toast.error("Please sign in to access the chat");
        navigate("/signin", { replace: true });
        return;
      }

      console.log('Full profile data:', profile);
      console.log('Payment status check:', {
        payment_status: profile.payment_status,
        payment_approval_status: profile.payment_approval_status,
        role: profile.role
      });

      // If we're already on the dashboard, don't redirect
      if (window.location.pathname === '/dashboard') {
        return;
      }

      // If user is paid and approved, redirect to dashboard
      if (profile.payment_status === 'paid' && profile.payment_approval_status === 'approved') {
        console.log('User is paid and approved, redirecting to dashboard');
        navigate("/dashboard", { replace: true });
        return;
      }

      // Check if user is unpaid and redirect to payment page
      if (profile.payment_status !== 'paid' || profile.payment_approval_status !== 'approved') {
        console.log('User not paid or approved, redirecting to payment');
        navigate("/payment", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);
};