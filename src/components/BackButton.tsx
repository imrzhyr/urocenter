import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

interface BackButtonProps {
  onClick?: () => void;
  customRoute?: string;
}

export const BackButton = ({ onClick, customRoute }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { profile } = useProfile();
  const isRTL = language === 'ar';

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (customRoute) {
      navigate(customRoute);
    } else if (location.pathname === '/signup') {
      navigate('/'); // Always navigate to welcome page from signup
    } else {
      navigate(-1); // This will take the user back to their previous location for other pages
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