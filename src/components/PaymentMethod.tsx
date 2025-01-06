import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-all",
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:border-primary/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={logo} alt={name} className="w-12 h-12 object-contain" />
          <span className="font-medium">{name}</span>
        </div>
        {selected && <Check className="w-5 h-5 text-primary" />}
      </div>
    </div>
  );
};