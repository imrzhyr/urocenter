import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface BackButtonProps {
  onClick?: () => void;
  customRoute?: string;
}

export const BackButton = ({ onClick, customRoute }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();
  const { profile } = useProfile();
  const isRTL = language === 'ar';
  const [showWarning, setShowWarning] = useState(false);

  const isOnboardingPage = ['/signup', '/profile', '/medical-information', '/payment'].includes(location.pathname);
  const isLeavingOnboarding = isOnboardingPage && (customRoute === '/' || (!customRoute && location.pathname === '/signup'));

  const handleClick = () => {
    if (isLeavingOnboarding) {
      setShowWarning(true);
    } else if (onClick) {
      onClick();
    } else if (customRoute) {
      navigate(customRoute);
    } else if (location.pathname === '/signup') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const handleConfirmLeave = () => {
    setShowWarning(false);
    if (customRoute) {
      navigate(customRoute);
    } else if (location.pathname === '/signup') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <>
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

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('leave_onboarding')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('leave_onboarding_warning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLeave}>{t('confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};