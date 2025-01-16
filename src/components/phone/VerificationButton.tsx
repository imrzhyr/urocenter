import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VerificationButtonProps {
  phone: string;
  password: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export const VerificationButton = ({ 
  phone, 
  password,
  onSuccess,
  disabled = false 
}: VerificationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSignUp = async () => {
    try {
      setIsLoading(true);

      // Format the phone number
      const formattedPhone = phone.startsWith('+964') ? phone : `+964${phone.replace(/^0+/, '')}`;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .single();

      if (existingUser) {
        toast.error(t('phone_already_exists'));
        return;
      }

      // Create new user in profiles table
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            phone: formattedPhone,
            password: password,
            role: 'patient'
          }
        ])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Store user info in localStorage
      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('userPassword', password);

      toast.success(t('signup_success'));
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
      onClick={handleSignUp}
      disabled={disabled || isLoading || !phone || !password}
      className="w-full"
    >
      {isLoading ? t('signing_up') : t('sign_up')}
    </Button>
  );
};