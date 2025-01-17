import { Headset } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const WhatsAppSupport = () => {
  const { t, isRTL } = useLanguage();
  
  const handleSupportClick = () => {
    const message = encodeURIComponent(t("payment_message"));
    window.open(`https://wa.me/9647702428154?text=${message}`, '_blank');
  };

  return (
    <Button
      onClick={handleSupportClick}
      variant="outline"
      size="sm"
      className={cn(
        "gap-2 bg-white/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 dark:bg-gray-900/50",
        isRTL && "flex-row-reverse"
      )}
      aria-label={t('get_support')}
    >
      <Headset className="h-5 w-5 text-primary" />
      <span className="text-primary font-medium">{t("help_center")}</span>
    </Button>
  );
};