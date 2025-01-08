import { motion, AnimatePresence } from "framer-motion";
import { ProgressSteps } from "@/components/ProgressSteps";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

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
  const currentStep = getStepFromPath(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-sky-50 via-white to-blue-50">
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm mb-6">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};