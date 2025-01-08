import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="w-full">
      <div className="relative flex justify-between">
        {/* Progress bar background */}
        <div className="absolute top-[1.125rem] left-0 w-full h-0.5 bg-gray-100" />
        
        {/* Animated progress bar */}
        <motion.div
          className="absolute top-[1.125rem] left-0 h-0.5 bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between w-full">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                  index < currentStep
                    ? "bg-primary border-primary text-white"
                    : index === currentStep
                    ? "border-primary text-primary bg-white"
                    : "border-gray-200 text-gray-400 bg-white"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};