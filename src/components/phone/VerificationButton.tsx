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
}

export const VerificationButton = ({ phone, password, onSuccess }: VerificationButtonProps) => {
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
      
      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('userPassword', password);

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking existing profile:", fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        toast.error(t('phone_already_exists'));
        return;
      }

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
        console.error("Error creating profile:", createError);
        throw createError;
      }

      console.log("Successfully created profile:", newProfile);
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
      whileHover={{ scale: isValid ? 1.02 : 1 }}
      whileTap={{ scale: isValid ? 0.98 : 1 }}
    >
      <Button
        onClick={handleSignUp}
        disabled={!isValid || isLoading}
        className={`w-full transition-all duration-200 ${
          isValid 
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