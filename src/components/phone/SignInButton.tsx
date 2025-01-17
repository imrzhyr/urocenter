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

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('password', password)
        .single();

      if (error || !data) {
        toast.error(t('invalid_credentials'));
        return;
      }

      localStorage.setItem('userPhone', formattedPhone);
      toast.success(t('signin_success'));

      // Handle admin users differently
      if (data.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      // For regular users, check payment status
      if (data.payment_status === 'paid' && data.payment_approval_status === 'approved') {
        navigate('/dashboard', { replace: true });
      } else if (data.payment_status === 'unpaid' || 
                (data.payment_status === 'unpaid' && data.payment_approval_status === 'pending') ||
                (data.payment_method && data.payment_status === 'unpaid')) {
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