import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PaymentMethodProps {
  id: string;
  name: string;
  description: string;
  logo: string;
  selected: boolean;
  onSelect: () => void;
  onContinue: () => void;
}

export const PaymentMethod = ({
  id,
  name,
  description,
  logo,
  selected,
  onSelect,
  onContinue,
}: PaymentMethodProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div
      className={cn(
        "relative rounded-lg border p-4 transition-all hover:shadow-md",
        selected ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-800"
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
          <img src={logo} alt={name} className="h-12 w-12 object-contain" />
          <div className={cn("space-y-1", isRTL && "text-right")}>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selected ? (
            <Button onClick={onContinue} className={cn(isRTL && "flex-row-reverse")}>
              {t("continue")}
            </Button>
          ) : (
            <Button variant="outline" onClick={onSelect} className={cn(isRTL && "flex-row-reverse")}>
              {t("select")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};