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

      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('profileId', profile.id);
      toast.success(t('signin_success'));

      if (profile.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      if (profile.payment_status === 'paid' && profile.payment_approval_status === 'approved') {
        navigate('/dashboard', { replace: true });
      } else if (profile.payment_method && profile.payment_status === 'unpaid') {
        navigate('/payment-verification', { replace: true });
      } else {
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