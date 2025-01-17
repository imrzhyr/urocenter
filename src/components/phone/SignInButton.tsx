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

      localStorage.setItem('userPhone', formattedPhone);
      toast.success(t('signin_success'));

      // Check payment status and approval status
      if (data.payment_status === 'unpaid' && data.payment_approval_status === 'pending') {
        // If payment is pending approval, redirect to payment page which will show the waiting screen
        navigate('/payment');
      } else if (data.payment_status !== 'paid') {
        // If no payment initiated yet, redirect to payment page to select payment method
        navigate('/payment');
      } else {
        // If payment is approved, redirect to dashboard
        navigate('/dashboard');
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