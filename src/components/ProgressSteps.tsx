import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="w-full px-4">
      <div className="relative">
        {/* Progress bar background */}
        <div 
          className="absolute top-[1.125rem] left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-700" 
          style={{ zIndex: 0 }}
        />
        
        {/* Active progress bar */}
        <div 
          className="absolute top-[1.125rem] h-0.5 bg-primary transition-all duration-500 ease-in-out"
          style={{ 
            ...(isRTL 
              ? { 
                  right: '0',
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }
              : {
                  left: '0',
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }
            ),
            zIndex: 1 
          }}
        />

        {/* Steps */}
        <div 
          className="relative grid"
          style={{ 
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            zIndex: 2 
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex flex-col items-center"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white dark:bg-gray-800",
                  index < currentStep
                    ? "border-primary bg-primary text-white"
                    : index === currentStep
                    ? "border-primary text-primary"
                    : "border-gray-200 text-gray-400 dark:border-gray-600"
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
                  "mt-2 text-xs font-medium text-center whitespace-nowrap px-1 transition-colors duration-300",
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