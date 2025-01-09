import { motion, AnimatePresence } from "framer-motion";
import { ProgressSteps } from "@/components/ProgressSteps";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ArrowLeft } from "lucide-react";

const steps = ["Sign Up", "Profile", "Medical Info", "Payment"];

const getStepFromPath = (pathname: string) => {
  switch (pathname) {
    case "/signup":
      return 0;
    case "/profile":
      return 1;
    case "/medical-information":
      return 2;
    case "/payment":
      return 3;
    default:
      return 0;
  }
};

export const OnboardingLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStep = getStepFromPath(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-background">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container max-w-4xl mx-auto p-4 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <LanguageSelector />
        </div>
        <div className="container max-w-4xl mx-auto px-4 pb-6">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground">
        © 2024 All rights reserved
      </footer>
    </div>
  );
};