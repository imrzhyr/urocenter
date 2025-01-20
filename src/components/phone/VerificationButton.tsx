import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface VerificationButtonProps {
  phone: string;
  password: string;
  onSuccess?: () => void;
  disabled?: boolean;
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
      toast.error(t('invalid_phone'), {
        className: cn(
          "bg-white/80 dark:bg-[#1C1C1E]/80",
          "backdrop-blur-xl",
          "border border-[#3C3C43]/20 dark:border-white/10",
          "text-[#000000] dark:text-white",
          "rounded-2xl"
        )
      });
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
        toast.error(t('phone_already_exists'), {
          className: cn(
            "bg-white/80 dark:bg-[#1C1C1E]/80",
            "backdrop-blur-xl",
            "border border-[#3C3C43]/20 dark:border-white/10",
            "text-[#000000] dark:text-white",
            "rounded-2xl"
          )
        });
        setIsLoading(false);
        return;
      }

      // Create the profile directly without auth
      const { data: profileData, error: profileError } = await supabase
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

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }

      console.log("Successfully created profile");
      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('userPassword', password);
      localStorage.setItem('profileId', profileData.id);
      toast.success(t('signup_success'), {
        className: cn(
          "bg-white/80 dark:bg-[#1C1C1E]/80",
          "backdrop-blur-xl",
          "border border-[#3C3C43]/20 dark:border-white/10",
          "text-[#000000] dark:text-white",
          "rounded-2xl"
        )
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('signup_error'), {
        className: cn(
          "bg-white/80 dark:bg-[#1C1C1E]/80",
          "backdrop-blur-xl",
          "border border-[#3C3C43]/20 dark:border-white/10",
          "text-[#000000] dark:text-white",
          "rounded-2xl"
        )
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={handleSignUp}
        disabled={!isValid || isLoading || disabled}
        className={cn(
          "w-full",
          "h-[44px]", // iOS minimum touch target
          "text-[17px] font-medium", // iOS body text
          "rounded-xl", // iOS corner radius
          "shadow-sm",
          "transition-all duration-200",
          "disabled:opacity-50",
          "active:scale-[0.97]", // iOS press animation
          isValid && !disabled
            ? "bg-[#007AFF] dark:bg-[#0A84FF] hover:bg-[#0071E3] dark:hover:bg-[#0A84FF]/90 text-white"
            : "bg-[#F2F2F7] dark:bg-[#1C1C1E] text-[#8E8E93] dark:text-[#98989D] cursor-not-allowed"
        )}
      >
        <span className={cn(
          "flex items-center justify-center gap-2",
          isLoading && "opacity-0"
        )}>
          {t('create_account')}
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
      </Button>
    </motion.div>
  );
};