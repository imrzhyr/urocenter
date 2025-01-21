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
  const { t } = useLanguage();
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
    // Clear all storage and state
    clearState();
    sessionStorage.clear();
  }, [clearState]);

  const handleSignUp = async () => {
    if (!acceptedTerms) {
      toast.error(t("please_accept_terms"));
      return;
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      // Clear any existing state first
      clearState();
      
      const formattedPhone = `964${phone}`;
      
      // Create profile in Supabase
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
        if (profileError.code === '23505') { // Unique constraint violation
          toast.error(t("phone_already_exists"));
        } else {
          throw profileError;
        }
        return;
      }

      // Store credentials
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
      y: 20,
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      }
    }
  };

  const inputVariants = {
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

  return (
    <motion.div
      className="flex-1 flex flex-col p-4 max-w-md w-full mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.h1 
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
      >
        {t("sign_up")}
      </motion.h1>

      <div className="space-y-6">
        <motion.div 
          className="space-y-1"
          whileTap="tap"
          whileFocus="focus"
          variants={inputVariants}
        >
          <label className="text-sm text-gray-600">
            {t("phoneNumber")}
          </label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
          />
        </motion.div>

        <motion.div 
          className="space-y-1"
          whileTap="tap"
          whileFocus="focus"
          variants={inputVariants}
        >
          <label className="text-sm text-gray-600">
            {t("createPassword")}
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordMinChars")}
              className={cn(
                "h-12 text-base rounded-lg bg-[#F1F5F9] border-0 pr-10",
                passwordError && "border-red-500 focus:border-red-500 focus:ring-red-500",
                "focus:border-primary focus:ring-1 focus:ring-primary",
                "transition-all duration-200"
              )}
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </motion.button>
          </div>
          <AnimatePresence>
            {passwordError && (
              <motion.p 
                className="text-sm text-red-500"
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
          className="space-y-1"
          whileTap="tap"
          whileFocus="focus"
          variants={inputVariants}
        >
          <label className="text-sm text-gray-600">
            {t("confirmPassword")}
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("repeatPassword")}
              className={cn(
                "h-12 text-base rounded-lg bg-[#F1F5F9] border-0 pr-10",
                confirmPasswordError && "border-red-500 focus:border-red-500 focus:ring-red-500",
                "focus:border-primary focus:ring-1 focus:ring-primary",
                "transition-all duration-200"
              )}
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </motion.button>
          </div>
          <AnimatePresence>
            {confirmPasswordError && (
              <motion.p 
                className="text-sm text-red-500"
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
          />
          <div className="text-sm text-gray-600">
            <label htmlFor="terms" className="inline">
              {t("i_accept")}{" "}
            </label>
            <Link to="/terms" className="text-primary hover:underline">
              {t("terms_and_conditions")}
            </Link>
          </div>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button
            onClick={handleSignUp}
            disabled={!isValid || isLoading}
            className={cn(
              "w-full h-[44px] text-[17px] font-medium rounded-xl",
              "bg-[#007AFF] hover:bg-[#0071E3] text-white",
              "transition-all duration-200",
              "active:scale-[0.97]"
            )}
          >
            {isLoading ? t("signing_up") : t("continueToProfile")}
          </Button>
        </motion.div>

        <motion.p 
          className="text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t("alreadyHaveAccount")}{" "}
          <Link to="/signin" className="text-primary hover:underline">
            {t("sign_in")}
          </Link>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SignUp;