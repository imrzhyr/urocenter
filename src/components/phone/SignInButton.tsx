import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPhoneNumber } from "@/utils/phoneUtils";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfileState } from "@/hooks/useProfileState";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface SignInButtonProps {
  phone: string;
  password: string;
  disabled?: boolean;
}

export const SignInButton = ({ phone, password, disabled }: SignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setState } = useProfileState();

  // Validation rules
  const isValid = useMemo(() => {
    const isPhoneValid = phone.length >= 10 && /^\d+$/.test(phone);
    const isPasswordValid = password.length >= 6;
    return isPhoneValid && isPasswordValid;
  }, [phone, password]);

  const handleSignIn = async () => {
    if (!isValid) {
      toast.error(t('invalid_credentials'), {
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
      console.log("Attempting to sign in with:", { formattedPhone });

      // Check if the profile exists and password matches
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('password', password)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      if (!profile) {
        toast.error(t('invalid_credentials'), {
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

      // Store user info in localStorage
      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('userPassword', password);
      localStorage.setItem('profileId', profile.id);

      toast.success(t('signin_success'), {
        className: cn(
          "bg-white/80 dark:bg-[#1C1C1E]/80",
          "backdrop-blur-xl",
          "border border-[#3C3C43]/20 dark:border-white/10",
          "text-[#000000] dark:text-white",
          "rounded-2xl"
        )
      });

      // Navigate based on profile completion
      if (!profile.full_name) {
        navigate('/profile');
      } else if (!profile.complaint) {
        navigate('/medical-information');
      } else if (profile.payment_status === 'unpaid') {
        navigate('/payment');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error(t('signin_error'), {
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
        onClick={handleSignIn}
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
          {t('sign_in')}
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