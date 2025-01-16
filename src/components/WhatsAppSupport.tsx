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
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-accent transition-colors"
      aria-label={t('get_support')}
    >
      <Headset className="h-5 w-5" />
    </Button>
  );
};