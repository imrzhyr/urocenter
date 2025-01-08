import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="w-full px-4">
      <div className="relative flex justify-between">
        {/* Progress bar background */}
        <div className="absolute top-[1.125rem] left-[1.125rem] right-[1.125rem] h-0.5 bg-gray-100" />
        
        {/* Animated progress bar */}
        <motion.div
          className="absolute top-[1.125rem] left-[1.125rem] h-0.5 bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between w-full">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white",
                  index < currentStep
                    ? "border-primary bg-primary text-white"
                    : index === currentStep
                    ? "border-primary text-primary"
                    : "border-gray-200 text-gray-400"
                )}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium transition-colors duration-300",
                  index <= currentStep ? "text-primary" : "text-gray-400"
                )}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};