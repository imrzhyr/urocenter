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
        "p-3 border rounded-lg cursor-pointer transition-all transform hover:scale-105",
        selected
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-gray-200 hover:border-primary/50"
      )}
    >
      <div className="flex flex-col items-center space-y-2">
        <img src={logo} alt={name} className="w-10 h-10 object-contain" />
        <span className="text-sm font-medium">{name}</span>
        {selected && <Check className="w-4 h-4 text-primary" />}
      </div>
    </div>
  );
};