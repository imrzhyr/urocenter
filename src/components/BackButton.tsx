import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  onClick?: () => void;
}

export const BackButton = ({ onClick }: BackButtonProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-accent transition-colors ${isRTL ? 'rotate-180' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={isRTL ? 'رجوع' : 'Back'}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};