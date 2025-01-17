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
      
      // Format the phone number to ensure it has the correct format
      let formattedPhone = phone;
      
      // Handle special admin cases first
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

      // Store the phone number first
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

      toast.success(t('signin_success'));

      console.log("Sign in successful, user data:", {
        role: data.role,
        payment_status: data.payment_status,
        payment_approval_status: data.payment_approval_status
      });

      // Check role first
      if (data.role === 'admin') {
        console.log("User is admin, redirecting to admin dashboard");
        navigate('/admin', { replace: true });
        return;
      }

      // Check payment status
      const isPaid = data.payment_status === 'paid';
      const isApproved = data.payment_approval_status === 'approved';
      const isPending = data.payment_approval_status === 'pending';

      console.log("Payment status check:", {
        isPaid,
        isApproved,
        isPending,
        shouldGoToDashboard: isPaid && isApproved
      });

      if (isPaid && isApproved) {
        console.log("User is paid and approved, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
        return;
      }

      // If payment is pending approval, show waiting screen
      if (isPending) {
        console.log("Payment is pending approval, showing waiting screen");
        navigate('/payment', { replace: true });
        return;
      }

      // For all other cases (unpaid, not pending), go to payment page
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