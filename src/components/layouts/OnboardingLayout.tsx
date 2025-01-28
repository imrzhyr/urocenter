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
    <motion.div
      className="min-h-screen flex flex-col bg-[#000B1D]"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.header 
        variants={headerVariants}
        className="sticky top-0 z-50 backdrop-blur-xl bg-[#000B1D]/50 border-b border-white/[0.08]"
      >
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between h-[72px] px-4">
            <motion.div 
              className="w-[72px] flex items-center"
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
              className="w-[72px] flex items-center justify-end"
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
          <div className="px-4 pb-4">
            <ProgressSteps 
              steps={steps} 
              currentStep={Math.max(currentStep, getCompletedStep())} 
            />
          </div>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {showLanguageMenu && (
          <LanguageSelector onClose={() => setShowLanguageMenu(false)} />
        )}
      </AnimatePresence>

      <Outlet />
    </motion.div>
  );
};