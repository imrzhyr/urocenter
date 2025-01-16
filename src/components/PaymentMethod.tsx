import { cn } from "@/lib/utils";
import { Check, CreditCard, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface PaymentMethodProps {
  id: string;
  name: string;
  logo: string;
  selected: boolean;
  onSelect: () => void;
  onContinue: () => void;
  isPaid?: boolean;
}

export const PaymentMethod = ({
  id,
  name,
  logo,
  selected,
  onSelect,
  onContinue,
  isPaid = false,
}: PaymentMethodProps) => {
  const [imageError, setImageError] = useState(false);
  const isCreditCard = id === "credit-card";

  return (
    <div
      className={cn(
        "p-4 border rounded-lg transition-all",
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
        
        <div className="flex flex-col items-center gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            Select
          </Button>
          
          {selected && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onContinue();
              }}
              className="w-full gap-2"
              size="sm"
            >
              Continue to Payment <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>

        {isPaid && <Check className="w-4 h-4 text-green-500" />}
        
        <div className="text-xs font-medium">
          {isPaid ? (
            <span className="text-green-500">Payment Completed</span>
          ) : (
            <span className="text-yellow-600">Not Paid Yet</span>
          )}
        </div>
      </div>
    </div>
  );
};