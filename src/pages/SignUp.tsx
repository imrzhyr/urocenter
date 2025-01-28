import { useState, useEffect, useMemo } from "react";
import { PhoneInput } from "@/components/PhoneInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useProfileState } from "@/hooks/useProfileState";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { clearState } = useProfileState();

  // Password validation
  const passwordError = useMemo(() => {
    if (password && password.length < 6) {
      return t("passwordMinChars");
    }
    return "";
  }, [password, t]);

  // Confirm password validation
  const confirmPasswordError = useMemo(() => {
    if (confirmPassword && password !== confirmPassword) {
      return t("passwords_must_match");
    }
    return "";
  }, [password, confirmPassword, t]);

  // Form validation
  const isValid = useMemo(() => {
    const isPhoneValid = phone.length === 10 && phone.startsWith("7");
    const isPasswordValid = password.length >= 6;
    const doPasswordsMatch = password === confirmPassword;
    return isPhoneValid && isPasswordValid && doPasswordsMatch && acceptedTerms;
  }, [phone, password, confirmPassword, acceptedTerms]);

  // Clear any existing user data when entering signup
  useEffect(() => {
    clearState();
    sessionStorage.clear();
  }, [clearState]);

  const handleSignUp = async () => {
    if (!acceptedTerms) {
      toast.error(t("please_accept_terms"), {
        className: cn(
          "bg-[#1C1C1E]/80 backdrop-blur-xl",
          "border border-white/[0.08]",
          "text-white",
          "rounded-2xl"
        )
      });
      return;
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      clearState();
      
      const formattedPhone = `+964${phone}`;
      
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
        if (profileError.code === '23505') {
          toast.error(t("phone_already_exists"));
        } else {
          throw profileError;
        }
        return;
      }

      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('userPassword', password);
      localStorage.setItem('profileId', profileData.id);

      toast.success(t("signup_success"));
      navigate('/profile', { replace: true });
    } catch (error) {
      console.error('Error:', error);
      toast.error(t("signup_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = {
    initial: { 
      opacity: 0,
      x: 20,
    },
    animate: { 
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      }
    },
    exit: { 
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      }
    }
  };

  const inputVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    focus: { 
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const isRTL = language === 'ar';

  return (
    <motion.div
      className="flex-1 flex flex-col p-4 max-w-md w-full mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.h1 
        className="text-4xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
      >
        <span className="bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">
          {t("sign_up")}
        </span>
      </motion.h1>

      <motion.div 
        className="space-y-8"
        initial="initial"
        animate="animate"
        variants={inputVariants}
      >
        <motion.div 
          className="space-y-3"
          whileTap="tap"
          whileFocus="focus"
          variants={inputVariants}
        >
          <label className="text-[15px] font-medium text-[#98989D] px-1">
            {t("phoneNumber")}
          </label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            className="bg-[#1C1C1E] backdrop-blur-xl border border-white/[0.08] text-white hover:bg-[#1C1C1E]/70 rounded-xl h-12 shadow-lg shadow-black/5 [&_input]:bg-[#1C1C1E] [&_input]:text-white [&_*]:bg-[#1C1C1E] [&_.PhoneInputCountry]:bg-[#1C1C1E]"
          />
        </motion.div>

        <motion.div 
          className="space-y-3"
          whileTap="tap"
          whileFocus="focus"
          variants={inputVariants}
        >
          <label className="text-[15px] font-medium text-[#98989D] px-1">
            {t("createPassword")}
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordMinChars")}
              className={cn(
                "h-12 text-base rounded-xl",
                "bg-[#1C1C1E] backdrop-blur-xl border border-white/[0.08] text-white",
                "hover:bg-[#1C1C1E]/70",
                "focus:outline-none focus:ring-0 focus:border-white/[0.08]",
                "transition-all duration-200",
                "placeholder:text-[#98989D]",
                "shadow-lg shadow-black/5",
                passwordError && "border-red-500/50"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-[#98989D] h-10 w-10 flex items-center justify-center",
                isRTL ? "left-3" : "right-3"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </motion.div>
            </button>
          </div>
          <AnimatePresence>
            {passwordError && (
              <motion.p 
                className="text-sm text-red-500/90"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {passwordError}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="space-y-3"
          whileTap="tap"
          whileFocus="focus"
          variants={inputVariants}
        >
          <label className="text-[15px] font-medium text-[#98989D] px-1">
            {t("confirmPassword")}
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("repeatPassword")}
              className={cn(
                "h-12 text-base rounded-xl",
                "bg-[#1C1C1E] backdrop-blur-xl border border-white/[0.08] text-white",
                "hover:bg-[#1C1C1E]/70",
                "focus:outline-none focus:ring-0 focus:border-white/[0.08]",
                "transition-all duration-200",
                "placeholder:text-[#98989D]",
                "shadow-lg shadow-black/5",
                confirmPasswordError && "border-red-500/50"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-[#98989D] h-10 w-10 flex items-center justify-center",
                isRTL ? "left-3" : "right-3"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </motion.div>
            </button>
          </div>
          <AnimatePresence>
            {confirmPasswordError && (
              <motion.p 
                className="text-sm text-red-500/90"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {confirmPasswordError}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="flex items-center space-x-2"
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Checkbox 
            id="terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            className="bg-[#1C1C1E] border-white/[0.08] data-[state=checked]:bg-[#0A84FF] data-[state=checked]:border-[#0A84FF]"
          />
          <div className="text-[15px] text-[#98989D]">
            <label htmlFor="terms" className="inline">
              {t("i_accept")}{" "}
            </label>
            <Link to="/terms" className="text-[#0A84FF] hover:opacity-90 transition-opacity">
              {t("terms_and_conditions")}
            </Link>
          </div>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="pt-4"
        >
          <Button
            onClick={handleSignUp}
            disabled={!isValid || isLoading}
            className={cn(
              "w-full",
              "h-[44px]",
              "text-[17px] font-medium",
              "rounded-xl",
              "shadow-lg",
              "transition-all duration-200",
              "disabled:opacity-50",
              "active:scale-[0.97]",
              isValid && !isLoading
                ? "bg-gradient-to-r from-[#0055D4] to-[#00A3FF] hover:opacity-90 text-white"
                : "bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] text-[#98989D] cursor-not-allowed"
            )}
          >
            <span className={cn(
              "flex items-center justify-center gap-2",
              isLoading && "opacity-0"
            )}>
              {t("continueToProfile")}
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </Button>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/signin"
            className="text-[15px] hover:opacity-90 transition-opacity"
          >
            {language === 'ar' ? (
              <>
                <span className="text-white">لديك حساب بالفعل؟</span>{' '}
                <span className="bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">تسجيل الدخول</span>
              </>
            ) : (
              <>
                <span className="text-white">Already have an account?</span>{' '}
                <span className="bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">Sign In</span>
              </>
            )}
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SignUp;