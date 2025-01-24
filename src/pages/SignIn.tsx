import { useState, useMemo } from "react";
import { PhoneInput } from "@/components/PhoneInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Globe } from "lucide-react";
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
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { clearState } = useProfileState();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const isRTL = language === 'ar';

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
      const formattedPhone = `+964${phone}`;
      
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
      scale: 0.98,
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
        staggerChildren: 0.1,
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.2,
      }
    }
  };

  const childVariants = {
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
    <div className="min-h-screen bg-[#000B1D] text-white">
      <motion.div 
        className="min-h-screen flex flex-col"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <motion.header 
          variants={childVariants}
          className="sticky top-0 z-50 w-full bg-[#000B1D]/50 backdrop-blur-lg border-b border-white/[0.08]"
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
              <button
                onClick={() => window.open('https://wa.me/+9647702428154', '_blank')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
              >
                <div className="w-5 h-5 text-[#0A84FF]">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4Z" fill="currentColor" fillOpacity="0.2"/>
                    <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-[15px] font-medium bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">
                  Help Center
                </span>
              </button>
            </motion.div>
            <motion.div 
              className="w-[72px] flex justify-end relative"
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] text-white hover:bg-white/[0.08] rounded-xl h-10 w-10"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <Globe className="h-5 w-5" />
              </Button>
              
              {showLanguageMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 bg-[#1C1C1E] border border-white/[0.08] rounded-xl overflow-hidden shadow-lg w-32"
                >
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLanguageMenu(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-[15px] transition-colors",
                      language === 'en' 
                        ? "bg-white/[0.08] text-white" 
                        : "text-white/70 hover:bg-white/[0.08]"
                    )}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setShowLanguageMenu(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-[15px] transition-colors",
                      language === 'ar' 
                        ? "bg-white/[0.08] text-white" 
                        : "text-white/70 hover:bg-white/[0.08]"
                    )}
                  >
                    العربية
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.header>

        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl mx-auto">
            <div className="flex-1 flex flex-col p-4 max-w-md w-full mx-auto">
              <motion.h1 
                variants={childVariants}
                className="text-4xl font-bold mb-12 text-center"
              >
                <span className="bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">
                  {t("sign_in")}
                </span>
              </motion.h1>

              <motion.div 
                className="space-y-8"
                variants={childVariants}
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
                    {t("enter_password")}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("enter_password")}
                      className={cn(
                        "h-12 text-base rounded-xl",
                        "bg-[#1C1C1E] backdrop-blur-xl border border-white/[0.08] text-white",
                        "hover:bg-[#1C1C1E]/70",
                        "focus:outline-none focus:ring-0 focus:border-white/[0.08]",
                        "transition-all duration-200",
                        "placeholder:text-[#98989D]",
                        "shadow-lg shadow-black/5"
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
                </motion.div>

                <motion.div
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="pt-4"
                >
                  <Button
                    onClick={handleSignIn}
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
                      {t("sign_in")}
                    </span>
                    {isLoading && (
                      <Loader2 className="h-5 w-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
                    to="/signup"
                    className="text-[15px] hover:opacity-90 transition-opacity"
                  >
                    {language === 'ar' ? (
                      <>
                        <span className="text-white">ليس لديك حساب؟</span>{' '}
                        <span className="bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">أنشئ الآن</span>
                      </>
                    ) : (
                      <>
                        <span className="text-white">Don't have an account?</span>{' '}
                        <span className="bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">Create now</span>
                      </>
                    )}
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default SignIn;