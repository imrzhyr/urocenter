import { useState, useMemo } from "react";
import { PhoneInput } from "@/components/PhoneInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { BackButton } from "@/components/BackButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useProfileState } from "@/hooks/useProfileState";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { clearState } = useProfileState();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [accountNotFound, setAccountNotFound] = useState(false);
  const isRTL = language === 'ar';

  // Add validation
  const isValid = useMemo(() => {
    const isPhoneValid = phone.length === 10 && phone.startsWith("7");
    return isPhoneValid;
  }, [phone]);

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAccountNotFound(false);

    try {
      // Clear existing profile state
      clearState();
      
      // Format phone number
      const formattedPhone = `+964${phone}`;
      
      // Check if user exists in profiles table
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', formattedPhone)
        .single();

      if (!existingProfile) {
        setIsLoading(false);
        setAccountNotFound(true);
        toast.error(t("account_not_found"));
        return;
      }

      // Start phone verification process
      const { error: signInError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (signInError) throw signInError;

      setShowOTPVerification(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error(t("signin_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = async () => {
    try {
      setIsLoading(true);
      const formattedPhone = `+964${phone}`;
      
      // Get the user session after OTP verification
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No session after verification');
      }

      // Try to get existing profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // If profile doesn't exist, create it
      if (!existingProfile && profileError?.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              phone: formattedPhone,
              role: 'patient',
              payment_status: 'unpaid'
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        
        localStorage.setItem('userPhone', formattedPhone);
        localStorage.setItem('profileId', session.user.id);
        
        // New user, redirect to profile completion
        navigate('/profile', { replace: true });
        return;
      }

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      // Store user info
      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('profileId', session.user.id);

      // Navigate based on profile completion and role
      if (existingProfile.role === 'admin') {
        navigate("/admin", { replace: true });
      } else if (!existingProfile.full_name) {
        navigate('/profile', { replace: true });
      } else if (!existingProfile.complaint) {
        navigate('/medical-information', { replace: true });
      } else if (existingProfile.payment_status === 'unpaid') {
        navigate('/payment', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t("signin_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const formattedPhone = `+964${phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast.success(t("code_resent"));
    } catch (error) {
      console.error('Error:', error);
      toast.error(t("resend_code_error"));
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={language}
        className="min-h-screen flex flex-col bg-[#000B1D]"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <motion.header 
          className="relative z-10"
          variants={pageVariants}
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
              className="w-[72px] flex justify-end"
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <button
                onClick={() => setShowLanguageMenu(true)}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
              >
                <Globe className="w-5 h-5 text-[#0A84FF]" />
              </button>
            </motion.div>
          </div>
        </motion.header>

        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl mx-auto">
            <div className="flex-1 flex flex-col p-4 max-w-md w-full mx-auto">
              <motion.h1 
                variants={pageVariants}
                className="text-4xl font-bold mb-12 text-center"
              >
                <span className="bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">
                  {t("sign_in")}
                </span>
              </motion.h1>

              <AnimatePresence mode="wait">
                {showOTPVerification ? (
                  <OTPVerification
                    phone={`+964${phone}`}
                    onVerificationComplete={handleVerificationComplete}
                    onResendCode={handleResendCode}
                  />
                ) : (
                  <motion.div 
                    className="space-y-8"
                    variants={pageVariants}
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

                    <motion.div className="space-y-4">
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

                      {accountNotFound && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-center gap-2"
                        >
                          <p className="text-[15px] text-[#98989D]">
                            {t("dont_have_account")}
                          </p>
                          <Button
                            onClick={() => navigate('/signup')}
                            className="bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] text-white hover:bg-white/[0.08] rounded-xl px-6"
                          >
                            {t("sign_up")}
                          </Button>
                        </motion.div>
                      )}

                      <motion.div
                        className="text-center mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          to="/signup"
                          className="text-[15px] hover:opacity-90 transition-opacity"
                        >
                          <span className="text-white">{t("dont_have_account")}</span>{' '}
                          <span className="bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent">
                            {t("sign_up")}
                          </span>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </motion.div>

      <AnimatePresence>
        {showLanguageMenu && (
          <LanguageSelector onClose={() => setShowLanguageMenu(false)} />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default SignIn;