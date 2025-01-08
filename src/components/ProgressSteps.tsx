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
        <div className="absolute top-[1.125rem] left-8 right-8 h-0.5 bg-gray-100" />
        
        {/* Progress bar */}
        <div 
          className="absolute top-[1.125rem] left-8 h-0.5 bg-primary transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * (100 - (100/steps.length))}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between w-full">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex flex-col items-center"
            >
              <div
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
              </div>
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