import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface PaymentMethodProps {
  id: string;
  name: string;
  logo: string;
  selected: boolean;
  onSelect: () => void;
  onContinue: () => void;
}

export const PaymentMethod = ({
  id,
  name,
  logo,
  selected,
  onSelect,
  onContinue,
}: PaymentMethodProps) => {
  const [imageError, setImageError] = useState(false);
  const isCreditCard = id === "credit-card";

  return (
    <div
      className={cn(
        "p-4 border rounded-lg transition-all flex items-center justify-between",
        selected
          ? "border-primary bg-primary/5 shadow-lg dark:bg-primary/10"
          : "border-gray-200 hover:border-primary/50 dark:border-gray-700"
      )}
    >
      <div className="flex items-center gap-4">
        {isCreditCard ? (
          <div className="w-12 h-12 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
        ) : !imageError ? (
          <img
            src={logo}
            alt={name}
            className="w-12 h-12 object-contain"
            onError={() => setImageError(true)}
            loading="eager"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs">
            {name}
          </div>
        )}
        <span className="text-sm font-medium dark:text-gray-200">{name}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={selected ? "default" : "outline"}
          size="sm"
          onClick={onSelect}
          className={cn(
            "min-w-[100px]",
            selected && "bg-primary hover:bg-primary/90"
          )}
        >
          {selected ? "Selected" : "Select"}
        </Button>
        {selected && (
          <Button
            onClick={onContinue}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            Contact Support
          </Button>
        )}
      </div>
    </div>
  );
};