import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPhoneNumber } from "@/utils/phoneUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfileState } from "@/hooks/useProfileState";

interface SignInButtonProps {
  phone: string;
  password: string;
}

export const SignInButton = ({ phone, password }: SignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setState } = useProfileState();

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
        phone
      });

      const { data: profile, error } = await supabase
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

      if (!profile) {
        toast.error(t('invalid_credentials'));
        return;
      }

      // Update the profile state
      setState({ profile });
      
      localStorage.setItem('userPhone', formattedPhone);
      toast.success(t('signin_success'));

      // Handle admin role first
      if (profile.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      // Handle patient role based on payment status
      if (profile.payment_status === 'paid' && profile.payment_approval_status === 'approved') {
        console.log('User is paid and approved, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } else if (profile.payment_method && profile.payment_status === 'unpaid') {
        console.log('User has payment method but is unpaid, redirecting to payment verification');
        navigate('/payment-verification', { replace: true });
      } else {
        console.log('User needs to select payment method, redirecting to payment');
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