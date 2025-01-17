import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
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

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .eq('password', password)
        .single();

      if (error || !data) {
        toast.error(t('invalid_credentials'));
        return;
      }

      localStorage.setItem('userPhone', phone);
      toast.success(t('auth_success'));
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(t('auth_error'));
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