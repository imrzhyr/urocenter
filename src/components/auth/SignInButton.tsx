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

      localStorage.setItem('userPhone', formattedPhone);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('password', password)
        .single();

      if (error || !data) {
        console.error("Sign in error:", error);
        localStorage.removeItem('userPhone');
        toast.error(t('invalid_credentials'));
        return;
      }

      console.log("Sign in successful, user data:", {
        role: data.role,
        payment_status: data.payment_status,
        payment_approval_status: data.payment_approval_status
      });

      if (data.role === 'admin') {
        console.log("User is admin, redirecting to admin dashboard");
        navigate('/admin', { replace: true });
        return;
      }

      const isPaid = data.payment_status === 'paid';
      const isApproved = data.payment_approval_status === 'approved';

      console.log("Payment status check:", {
        isPaid,
        isApproved,
        shouldGoToDashboard: isPaid && isApproved
      });

      if (isPaid && isApproved) {
        console.log("User is paid and approved, redirecting to dashboard");
        localStorage.setItem('userPaymentStatus', 'approved');
        navigate('/dashboard', { replace: true });
        return;
      }

      if (data.payment_approval_status === 'pending') {
        console.log("Payment is pending approval, showing waiting screen");
        navigate('/payment', { replace: true });
        return;
      }

      console.log("User needs to complete payment, redirecting to payment page");
      navigate('/payment', { replace: true });

    } catch (error) {
      console.error('Sign in error:', error);
      localStorage.removeItem('userPhone');
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