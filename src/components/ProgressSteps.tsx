import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="w-full py-2">
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full" />
        
        {/* Animated progress bar */}
        <motion.div
          className="absolute top-5 left-0 h-1 bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
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
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  index < currentStep
                    ? "bg-primary border-primary text-white"
                    : index === currentStep
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-300"
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
                  index <= currentStep ? "text-primary" : "text-gray-300"
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