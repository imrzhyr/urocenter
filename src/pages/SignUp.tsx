import { useState, useEffect, useMemo } from "react";
import { PhoneInput } from "@/components/PhoneInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useProfileState } from "@/hooks/useProfileState";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackButton } from "@/components/BackButton";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showTermsWarning, setShowTermsWarning] = useState(false);
  const [showPhoneWarning, setShowPhoneWarning] = useState(false);
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { clearState } = useProfileState();
  const isRTL = language === 'ar';

  // Form validation
  const isValid = useMemo(() => {
    const isPhoneValid = phone.length === 10 && phone.startsWith("7");
    return isPhoneValid && acceptedTerms;
  }, [phone, acceptedTerms]);

  // Clear any existing user data when entering signup
  useEffect(() => {
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
      // Format phone number to E.164 format
      // Remove any non-digits and ensure it starts with +964
      const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
      // If the number starts with 964, remove it to avoid duplication
      const numberWithoutPrefix = cleanPhone.replace(/^964/, '');
      const formattedPhone = `+964${numberWithoutPrefix}`;
      
      console.log('Sending phone number:', formattedPhone); // Debug log
      
      // Start phone verification process
      const { error: signUpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (signUpError) {
        console.error('SignUp Error:', signUpError); // Debug log
        if (signUpError.message.includes("Invalid 'To' Phone Number")) {
          toast.error(t("invalid_phone_format"));
          setIsLoading(false);
          return;
        }
        throw signUpError;
      }

      setShowOTPVerification(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error(t("signup_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = async () => {
    try {
      setIsLoading(true);
      const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
      const numberWithoutPrefix = cleanPhone.replace(/^964/, '');
      const formattedPhone = `+964${numberWithoutPrefix}`;
      
      // Get the user session after OTP verification
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No session after verification');
      }

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', formattedPhone)
        .single();

      if (existingProfile) {
        toast.error(t("phone_already_exists"));
        return;
      }

      // Create the profile with the auth user's ID
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: session.user.id,
            phone: formattedPhone,
            role: 'patient',
            payment_status: 'unpaid'
          }
        ]);

      if (profileError) {
        if (profileError.code === '23505') { // Unique violation
          toast.error(t("phone_already_exists"));
          return;
        }
        throw profileError;
      }

      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('profileId', session.user.id);

      toast.success(t("signup_success"));
      navigate('/profile', { replace: true });
    } catch (error) {
      console.error('Error:', error);
      toast.error(t("signup_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
      const numberWithoutPrefix = cleanPhone.replace(/^964/, '');
      const formattedPhone = `+964${numberWithoutPrefix}`;
      
      console.log('Resending to phone number:', formattedPhone); // Debug log
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error('Resend Error:', error); // Debug log
        throw error;
      }

      toast.success(t("code_resent"));
    } catch (error) {
      console.error('Error:', error);
      toast.error(t("resend_code_error"));
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

  return (
    <div className="min-h-screen flex flex-col bg-[#000000]">
      <motion.div
        className="flex-1 flex flex-col"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl mx-auto">
            <div className="flex-1 flex flex-col p-4 max-w-md w-full mx-auto">
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

                    <motion.div 
                      className="flex items-start gap-3"
                      variants={inputVariants}
                    >
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => {
                          setAcceptedTerms(checked as boolean);
                          if (checked) setShowTermsWarning(false);
                        }}
                        className="h-5 w-5 border-2 border-[#0A84FF] data-[state=checked]:bg-[#0A84FF] data-[state=checked]:text-white rounded-md"
                      />
                      <label 
                        htmlFor="terms" 
                        className="text-[15px] text-white/80 cursor-pointer select-none"
                      >
                        {t("i_accept")} {" "}
                        <Link to="/terms" className="text-[#0A84FF] hover:underline">
                          {t("terms_and_conditions")}
                        </Link>
                      </label>
                    </motion.div>

                    <motion.div variants={inputVariants}>
                      <Button
                        className={cn(
                          "w-full",
                          "h-[44px]",
                          "text-[17px] font-medium",
                          "rounded-xl",
                          "shadow-sm",
                          "transition-all duration-200",
                          "disabled:opacity-50",
                          "active:scale-[0.97]",
                          isValid
                            ? "bg-[#007AFF] dark:bg-[#0A84FF] hover:bg-[#0071E3] dark:hover:bg-[#0A84FF]/90 text-white"
                            : "bg-[#F2F2F7] dark:bg-[#1C1C1E] text-[#8E8E93] dark:text-[#98989D] cursor-not-allowed"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          
                          // Check phone number first
                          if (!phone || phone.length !== 10 || !phone.startsWith("7")) {
                            setShowPhoneWarning(true);
                            toast.error(t("invalid_phone"));
                            return;
                          }
                          setShowPhoneWarning(false);

                          // If phone is valid but terms not accepted
                          if (!acceptedTerms) {
                            setShowTermsWarning(true);
                            toast.error(t("please_accept_terms"));
                            return;
                          }

                          setShowTermsWarning(false);
                          handleSignUp();
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          t("sign_up")
                        )}
                      </Button>
                      {showPhoneWarning && (
                        <p className="text-[13px] text-[#FF453A] mt-2 text-center">
                          {t("invalid_phone")}
                        </p>
                      )}
                      {showTermsWarning && !showPhoneWarning && (
                        <p className="text-[13px] text-[#FF453A] mt-2 text-center">
                          {t("please_accept_terms_to_continue")}
                        </p>
                      )}
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
    </div>
  );
};

export default SignUp;