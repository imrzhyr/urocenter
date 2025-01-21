import { ProgressSteps } from "@/components/ProgressSteps";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { useProfile } from "@/hooks/useProfile";
import { motion, AnimatePresence } from "framer-motion";

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
  const { language, t } = useLanguage();
  const { profile } = useProfile();

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
      x: 50,
      opacity: 0 
    },
    animate: { 
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    },
    exit: { 
      x: -50,
      opacity: 0,
      transition: {
        duration: 0.2
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
        variants={headerVariants}
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
        className="p-4 text-center text-sm text-muted-foreground bg-white dark:bg-gray-900"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      >
        {language === 'ar' ? '© 2025 جميع الحقوق محفوظة' : '© 2025 All rights reserved'}
      </motion.footer>
    </motion.div>
  );
};