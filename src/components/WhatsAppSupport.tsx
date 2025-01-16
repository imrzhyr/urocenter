import { Headset } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhatsAppSupport = () => {
  const { t } = useLanguage();
  
  const handleSupportClick = () => {
    const message = encodeURIComponent("I want help with UroCenter app");
    window.open(`https://wa.me/9647702428154?text=${message}`, '_blank');
  };

  return (
    <Button
      onClick={handleSupportClick}
      variant="outline"
      size="sm"
      className="gap-2 bg-white/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 dark:bg-gray-900/50"
      aria-label={t('get_support')}
    >
      <Headset className="h-5 w-5 text-primary" />
      <span className="text-primary font-medium">Help Center</span>
    </Button>
  );
};