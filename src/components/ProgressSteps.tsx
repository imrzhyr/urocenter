import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  const { language, isRTL } = useLanguage();
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative">
      {/* Background line */}
      <div className="absolute top-[18px] h-[2px] bg-gray-200 -z-10" style={{
        left: 'calc(18px + (36px / 2))',
        right: 'calc(18px + (36px / 2))'
      }} />

      {/* Active progress line */}
      <div
        className="absolute top-[18px] h-[2px] bg-primary transition-all duration-300 -z-10"
        style={{
          width: `${progress}%`,
          [isRTL ? 'right' : 'left']: 'calc(18px + (36px / 2))'
        }}
      />

      {/* Steps */}
      <div className="grid relative z-10" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => {
          const isActive = index + 1 <= currentStep;
          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-[36px] h-[36px] rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 bg-white",
                  isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                )}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-sm text-center">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};