import { cn } from "@/lib/utils";
import { Check, CreditCard } from "lucide-react";
import { useState } from "react";

interface PaymentMethodProps {
  id: string;
  name: string;
  logo: string;
  selected: boolean;
  onSelect: () => void;
}

export const PaymentMethod = ({
  id,
  name,
  logo,
  selected,
  onSelect,
}: PaymentMethodProps) => {
  const [imageError, setImageError] = useState(false);

  const isCreditCard = id === "credit-card";

  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-all transform hover:scale-105",
        selected
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-gray-200 hover:border-primary/50"
      )}
    >
      <div className="flex flex-col items-center space-y-3">
        {isCreditCard ? (
          <div className="w-16 h-12 flex items-center justify-center">
            <CreditCard className="w-10 h-10 text-primary" />
          </div>
        ) : !imageError ? (
          <img
            src={logo}
            alt={name}
            className="w-16 h-12 object-contain"
            onError={() => setImageError(true)}
            loading="eager"
          />
        ) : (
          <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
            {name}
          </div>
        )}
        <span className="text-sm font-medium">{name}</span>
        {selected && <Check className="w-4 h-4 text-primary" />}
      </div>
    </div>
  );
};