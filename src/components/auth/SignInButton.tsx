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
        .maybeSingle();

      if (error) {
        console.error("Sign in error:", error);
        toast.error(t('auth_error'));
        return;
      }

      if (!data) {
        console.log("No user found with credentials");
        toast.error(t('invalid_credentials'));
        return;
      }

      // Ensure payment_status and payment_approval_status have default values
      const paymentStatus = data.payment_status || 'unpaid';
      const approvalStatus = data.payment_approval_status || 'pending';

      console.log("Sign in successful, user data:", {
        role: data.role,
        payment_status: paymentStatus,
        payment_approval_status: approvalStatus
      });

      localStorage.setItem('userPhone', formattedPhone);
      toast.success(t('signin_success'));

      if (data.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      // Check payment status and approval status
      if (paymentStatus === 'paid' && approvalStatus === 'approved') {
        navigate('/dashboard', { replace: true });
      } else if (data.payment_method && paymentStatus === 'unpaid') {
        // If payment method selected but payment pending
        navigate('/payment-verification', { replace: true });
      } else {
        // If no payment initiated yet
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