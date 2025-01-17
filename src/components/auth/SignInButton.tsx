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
      
      let formattedPhone = formatPhoneNumber(phone);
      
      console.log("Attempting sign in with formatted phone:", formattedPhone);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('password', password)
        .single();

      if (error) {
        console.error("Sign in error:", error);
        toast.error(t('auth_error'));
        return;
      }

      if (!profile) {
        toast.error(t('invalid_credentials'));
        return;
      }

      console.log("Found profile:", profile);

      localStorage.setItem('userPhone', formattedPhone);
      toast.success(t('signin_success'));

      if (profile.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      // Check payment status
      if (profile.payment_status === 'paid' && profile.payment_approval_status === 'approved') {
        console.log("User is paid and approved, navigating to dashboard");
        navigate('/dashboard', { replace: true });
      } else if (profile.payment_method && profile.payment_status === 'unpaid') {
        console.log("User has payment method but is unpaid, navigating to verification");
        navigate('/payment-verification', { replace: true });
      } else {
        console.log("User needs to complete payment, navigating to payment");
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