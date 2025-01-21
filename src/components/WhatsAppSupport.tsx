import { Headset } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const WhatsAppSupport = () => {
  const { t, isRTL } = useLanguage();
  
  const handleSupportClick = () => {
    const message = encodeURIComponent(t("help_message"));
    window.open(`https://wa.me/9647702428154?text=${message}`, '_blank');
  };

  return (
    <div className="flex justify-center w-full">
      <div className="relative">
        <div className="absolute inset-0 bg-[#007AFF] dark:bg-[#0A84FF] rounded-lg blur-md opacity-50 animate-pulse-slow" />
        <Button
          onClick={handleSupportClick}
          variant="outline"
          size="sm"
          className={cn(
            "relative bg-white dark:bg-gray-900",
            "gap-2 border-primary/20 hover:bg-primary/5 dark:hover:bg-primary/5",
            isRTL && "flex-row-reverse"
          )}
          aria-label={t('get_support')}
        >
          <Headset className="h-5 w-5 text-primary" />
          <span className="text-primary font-medium">{t("help_center")}</span>
        </Button>
      </div>
    </div>
  );
};