import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface VerificationButtonProps {
  phone: string;
  password: string;
  onSuccess?: () => void;
  disabled?: boolean;  // Added this prop
}

export const VerificationButton = ({ phone, password, onSuccess, disabled }: VerificationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Validation rules
  const isValid = useMemo(() => {
    const isPhoneValid = phone.length >= 10 && /^\d+$/.test(phone);
    const isPasswordValid = password.length >= 6;
    return isPhoneValid && isPasswordValid;
  }, [phone, password]);

  const handleSignUp = async () => {
    if (!isValid) {
      toast.error(t('invalid_phone'));
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = `+964${phone}`;
      console.log("Attempting to create account with:", { formattedPhone });

      // First check if the phone number already exists in profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .maybeSingle();

      if (existingProfile) {
        toast.error(t('phone_already_exists'));
        setIsLoading(false);
        return;
      }

      // Create the authenticated user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        phone: formattedPhone,
        password: password,
        options: {
          data: {
            phone: formattedPhone,
          }
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user returned from auth signup");
      }

      // Now create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            phone: formattedPhone,
            password: password,
            role: 'patient'
          }
        ]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        throw profileError;
      }

      console.log("Successfully created auth user and profile");
      localStorage.setItem('userPhone', formattedPhone);
      toast.success(t('signup_success'));

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('signup_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: isValid && !disabled ? 1.02 : 1 }}
      whileTap={{ scale: isValid && !disabled ? 0.98 : 1 }}
    >
      <Button
        onClick={handleSignUp}
        disabled={!isValid || isLoading || disabled}
        className={`w-full transition-all duration-200 ${
          isValid && !disabled
            ? 'bg-primary hover:bg-primary/90 text-white' 
            : 'bg-[#D3E4FD] text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('creating_account')}
          </span>
        ) : (
          t('create_account')
        )}
      </Button>
    </motion.div>
  );
};