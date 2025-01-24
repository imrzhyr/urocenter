import { ProgressSteps } from "@/components/ProgressSteps";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { useProfile } from "@/hooks/useProfile";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const getStepFromPath = (pathname: string) => {
  switch (pathname) {
    case "/signup":
      return 1;
    case "/profile":
      return 2;
    case "/medical-information":
      return 3;
    case "/payment":
      return 4;
    default:
      return 1;
  }
};

export const OnboardingLayout = () => {
  const location = useLocation();
  const currentStep = getStepFromPath(location.pathname);
  const { language, setLanguage, t } = useLanguage();
  const { profile } = useProfile();
  const isRTL = language === 'ar';
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const steps = language === 'ar' ? [
    "إنشاء حساب",
    "الملف الشخصي",
    "المعلومات الطبية",
    "الدفع"
  ] : [
    "Sign Up",
    "Profile",
    "Medical Information",
    "Payment"
  ];

  const getCompletedStep = () => {
    if (!profile || location.pathname === '/signup') return 1;
    
    if (profile.payment_status === 'paid') return 4;
    if (profile.full_name && profile.gender && profile.age) return 3;
    if (profile.phone) return 2;
    return 1;
  };

  // iOS-style animation variants
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

  const headerVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    }
  };

  const contentVariants = {
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
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={language}
        className={cn(
          "min-h-screen flex flex-col",
          "bg-[#000B1D] text-white",
          isRTL ? "rtl" : "ltr"
        )}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <motion.header 
          className="sticky top-0 z-50 w-full bg-[#000B1D]/50 backdrop-blur-xl border-b border-white/[0.08]"
          variants={contentVariants}
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
                  {t("help_center")}
                </span>
              </button>
            </motion.div>
            <motion.div 
              className="w-[72px] flex justify-end relative z-50"
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
                  className="absolute right-0 top-12 bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-lg w-32"
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
          <motion.div 
            className="container max-w-4xl mx-auto px-4 pb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          >
            <ProgressSteps 
              steps={steps} 
              currentStep={Math.max(currentStep, getCompletedStep())} 
            />
          </motion.div>
        </motion.header>

        <motion.main 
          className="flex-1 overflow-y-auto"
          variants={contentVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname}
              className="container max-w-4xl mx-auto"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={contentVariants}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </motion.main>

        <motion.footer 
          className={cn(
            "p-4 text-center text-sm",
            "text-[#98989D]",
            "bg-[#000B1D]/50 backdrop-blur-xl",
            "border-t border-white/[0.08]"
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        >
          {language === 'ar' ? '© 2025 جميع الحقوق محفوظة' : '© 2025 All rights reserved'}
        </motion.footer>
      </motion.div>
    </AnimatePresence>
  );
};