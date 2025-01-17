import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPhoneNumber } from "@/utils/phoneUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SignInButtonProps {
  phone: string;
  password: string;
}

export const SignInButton = ({ phone, password }: SignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignIn = async () => {
    if (!phone || !password) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    try {
      setIsLoading(true);
      
      let formattedPhone = phone;
      
      if (phone === '7705449905' || phone === '7702428154') {
        formattedPhone = `+964${phone}`;
      } else {
        formattedPhone = formatPhoneNumber(phone);
      }
      
      console.log("Attempting sign in with:", {
        formattedPhone,
        phone,
        password
      });

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('password', password)
        .single();

      if (error || !data) {
        console.error("Sign in error:", error);
        toast.error(t('invalid_credentials'));
        return;
      }

      console.log("Sign in successful, user data:", {
        role: data.role,
        payment_status: data.payment_status,
        payment_approval_status: data.payment_approval_status
      });

      localStorage.setItem('userPhone', formattedPhone);

      if (data.role === 'admin') {
        console.log("User is admin, redirecting to admin dashboard");
        navigate('/admin', { replace: true });
        return;
      }

      // Check if user has paid and payment is approved
      const isPaid = data.payment_status === 'paid';
      const isApproved = data.payment_approval_status === 'approved';

      if (isPaid && isApproved) {
        localStorage.setItem('userPaymentStatus', 'approved');
        console.log("User is paid and approved, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
      } else if (data.payment_method && data.payment_status === 'unpaid') {
        // If payment method selected but payment pending
        console.log("Payment pending verification");
        navigate('/payment-verification', { replace: true });
      } else {
        // If no payment initiated yet
        console.log("User needs to make payment");
        localStorage.removeItem('userPaymentStatus');
        navigate('/payment', { replace: true });
      }

    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(t('signin_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? t('signing_in') : t('sign_in')}
    </Button>
  );
};