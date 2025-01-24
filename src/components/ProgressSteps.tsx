import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number; // This is now 1-based
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  const { language, isRTL } = useLanguage();
  
  // Calculate progress based on steps: 1->0%, 2->33%, 3->66%, 4->100%
  const getProgress = (step: number) => {
    switch (step) {
      case 1: return 0;
      case 2: return 0.33;
      case 3: return 0.66;
      case 4: return 1;
      default: return 0;
    }
  };
  
  const progress = getProgress(currentStep);

  const stepVariants = {
    inactive: {
      scale: 1,
      backgroundColor: "#1C1C1E",
      borderColor: "rgba(255, 255, 255, 0.08)",
      color: "#98989D"
    },
    active: {
      scale: 1.05,
      backgroundColor: "#0A84FF",
      borderColor: "#0A84FF",
      color: "#FFFFFF",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const checkmarkVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const labelVariants = {
    initial: { 
      y: 5,
      opacity: 0 
    },
    animate: { 
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <div className="relative">
      {/* Grid container */}
      <div className="grid relative" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {/* Background line */}
        <div 
          className="absolute top-[18px] h-[2px] bg-[#1C1C1E] -z-10" 
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            gridColumn: '1 / -1',
            width: '75%'
          }}
        />
        
        {/* Active progress line */}
        <motion.div 
          className="absolute top-[18px] h-[2px] bg-[#0A84FF] -z-10" 
          style={{
            left: isRTL ? undefined : '12.5%',
            right: isRTL ? '12.5%' : undefined,
            width: '75%',
            transformOrigin: isRTL ? 'right' : 'left'
          }}
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: progress,
            transition: {
              type: "spring",
              stiffness: 120,
              damping: 20
            }
          }}
        />

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <motion.div
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                "transition-shadow duration-200",
                index + 1 <= currentStep && "shadow-lg shadow-[#0A84FF]/20"
              )}
              initial="inactive"
              animate={index + 1 <= currentStep ? "active" : "inactive"}
              variants={stepVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {index + 1 < currentStep ? (
                <motion.svg
                  key="checkmark"
                  variants={checkmarkVariants}
                  initial="initial"
                  animate="animate"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : (
                <motion.span
                  key="number"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }
                  }}
                  className={cn(
                    "font-medium",
                    index + 1 === currentStep && "text-white text-[15px]"
                  )}
                >
                  {index + 1}
                </motion.span>
              )}
            </motion.div>
            <motion.div
              variants={labelVariants}
              initial="initial"
              animate="animate"
              className={cn(
                "text-sm text-center transition-colors duration-200",
                index + 1 <= currentStep 
                  ? "text-white bg-gradient-to-r from-[#0055D4]/10 to-[#00A3FF]/10 px-3 py-1 rounded-full backdrop-blur-sm" 
                  : "text-[#98989D]"
              )}
            >
              {step}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};