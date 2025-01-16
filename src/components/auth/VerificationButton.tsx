import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface VerificationButtonProps {
  phone: string;
  password: string;
  onSuccess?: () => void;
}

export const VerificationButton = ({ phone, password, onSuccess }: VerificationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSignUp = async () => {
    if (!phone || !password) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.from('profiles').insert({
        phone,
        password,
        role: 'patient',
        payment_status: 'unpaid'
      });

      if (error) {
        if (error.code === '23505') {
          toast.error(t('phone_already_exists'));
        } else {
          toast.error(t('signup_error'));
        }
        return;
      }

      toast.success(t('signup_success'));
      localStorage.setItem('userPhone', phone);
      onSuccess?.();
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(t('signup_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handleSignUp}
      disabled={isLoading}
    >
      {isLoading ? t('signing_up') : t('sign_up')}
    </Button>
  );
};