import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

interface BackButtonProps {
  onClick?: () => void;
  customRoute?: string;
}

export const BackButton = ({ onClick, customRoute }: BackButtonProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { profile } = useProfile();
  const isRTL = language === 'ar';

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (customRoute) {
      navigate(customRoute);
    } else {
      // Navigate based on user role
      if (profile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
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