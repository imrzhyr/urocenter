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
      backgroundColor: "rgb(229, 231, 235)",
      color: "rgb(107, 114, 128)"
    },
    active: { 
      scale: 1.1,
      backgroundColor: "#007AFF",
      color: "white",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const checkmarkVariants = {
    initial: { 
      scale: 0,
      opacity: 0 
    },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2
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
          className="absolute top-[18px] h-[2px] bg-gray-200 -z-10" 
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            gridColumn: '1 / -1',
            width: '75%'
          }}
        />

        {/* Active progress line */}
        <motion.div
          className="absolute top-[18px] h-[2px] -z-10" 
          style={{
            left: '12.5%',  // Start from the left edge (50% - 75%/2)
            width: '75%',
            backgroundColor: "#007AFF",
            transformOrigin: 'left'
          }}
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: 0.66,
            transition: {
              type: "spring",
              stiffness: 120,
              damping: 20
            }
          }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "w-[36px] h-[36px] rounded-full flex items-center justify-center text-sm font-medium",
                  "transition-shadow duration-300",
                  isActive && "shadow-[0_2px_8px_rgba(0,122,255,0.25)]"
                )}
                initial="inactive"
                animate={isActive ? "active" : "inactive"}
                variants={stepVariants}
                whileTap={isActive ? { scale: 0.95 } : {}}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="checkmark"
                      variants={checkmarkVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      variants={checkmarkVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {stepNumber}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.span 
                className={cn(
                  "mt-2 text-sm text-center",
                  isActive && "text-[#007AFF]"
                )}
                variants={labelVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                {step}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};