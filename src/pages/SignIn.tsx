import { useState, useMemo } from "react";
import { PhoneInput } from "@/components/PhoneInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { BackButton } from "@/components/BackButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useProfileState } from "@/hooks/useProfileState";

const SignIn = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { clearState } = useProfileState();

  // Add validation
  const isValid = useMemo(() => {
    const isPhoneValid = phone.length === 10 && phone.startsWith("7");
    const isPasswordValid = password.length >= 6;
    return isPhoneValid && isPasswordValid;
  }, [phone, password]);

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clear existing profile state
      clearState();
      
      // Format phone number
      const formattedPhone = phone.startsWith('+') ? phone : `+964${phone}`;
      
      console.log("Attempting sign in with:", { phone: formattedPhone, password });

      // Get profile data and check password
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('password', password)
        .single();

      if (profileError || !profileData) {
        console.error("Profile fetch error:", profileError);
        toast.error(t("invalid_phone_or_password"));
        return;
      }

      console.log("Found profile:", profileData);

      // Store profile ID and phone in localStorage
      localStorage.setItem('profileId', profileData.id);
      localStorage.setItem('userPhone', formattedPhone);

      // Check role and redirect
      if (profileData.role === 'admin') {
        console.log("User is admin, redirecting to admin dashboard");
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(t("invalid_phone_or_password"));
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
      className="min-h-screen flex flex-col bg-background"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.header 
        className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container max-w-4xl mx-auto p-4 flex items-center">
          <motion.div 
            className="w-[72px]"
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <BackButton />
          </motion.div>
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
          >
            <WhatsAppSupport />
          </motion.div>
          <motion.div 
            className="w-[72px] flex justify-end"
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <LanguageSelector />
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto">
          <div className="flex-1 flex flex-col p-4 max-w-md w-full mx-auto">
            <motion.h1 
              className="text-3xl font-bold mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
            >
              {t("sign_in")}
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
                  {t("enter_password")}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("enter_password")}
                    className={cn(
                      "h-12 text-base rounded-lg bg-[#F1F5F9] border-0 pr-10",
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
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  onClick={handleSignIn}
                  disabled={!isValid || isLoading}
                  className={cn(
                    "w-full",
                    "h-[44px]",
                    "text-[17px] font-medium",
                    "rounded-xl",
                    "shadow-sm",
                    "transition-all duration-200",
                    "disabled:opacity-50",
                    "active:scale-[0.97]",
                    isValid && !isLoading
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
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              <motion.p 
                className="text-center text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t("dont_have_account")}{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  {t("sign_up")}
                </Link>
              </motion.p>
            </div>
          </div>
        </div>
      </main>

      <motion.footer 
        className="p-4 text-center text-sm text-muted-foreground bg-white dark:bg-gray-900"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 30 }}
      >
        © 2025 All rights reserved
      </motion.footer>
    </motion.div>
  );
};

export default SignIn;