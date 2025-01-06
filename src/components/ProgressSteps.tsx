import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300",
                index < currentStep
                  ? "bg-primary border-primary text-white"
                  : index === currentStep
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-300"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "mt-2 text-sm transition-colors duration-300",
                index <= currentStep ? "text-primary" : "text-gray-300"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-1 bg-gray-200 rounded">
        <div
          className="h-full bg-primary rounded transition-all duration-300"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};