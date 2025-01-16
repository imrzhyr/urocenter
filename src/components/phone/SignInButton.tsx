import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SignInButtonProps {
  phone: string;
  password: string;
}

export const SignInButton = ({ phone, password }: SignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);

      // Format the phone number
      const formattedPhone = phone.startsWith('+964') ? phone : `+964${phone.replace(/^0+/, '')}`;

      // Check if user exists in profiles table
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('password', password)
        .single();

      if (profileError || !profiles) {
        toast.error(t('invalid_credentials'));
        return;
      }

      // Store user info in localStorage
      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('userPassword', password);

      // Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', profiles.id);

      toast.success(t('sign_in_success'));
      navigate("/dashboard");

    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(t('sign_in_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSignIn}
      disabled={isLoading || !phone || !password}
      className="w-full"
    >
      {isLoading ? t('signing_in') : t('sign_in')}
    </Button>
  );
};