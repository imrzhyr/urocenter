import { ProgressSteps } from "@/components/ProgressSteps";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { useProfile } from "@/hooks/useProfile";

const getStepFromPath = (pathname: string) => {
  switch (pathname) {
    case "/signup":
      return 0;
    case "/profile":
      return 1;
    case "/medical-information":
      return 2;
    case "/payment":
      return 3;
    default:
      return 0;
  }
};

export const OnboardingLayout = () => {
  const location = useLocation();
  const currentStep = getStepFromPath(location.pathname);
  const { language, t } = useLanguage();
  const { profile } = useProfile();

  const steps = [
    t("create_account"),
    t("complete_profile"),
    t("medical_information"),
    t("payment_details")
  ];

  // Calculate completed step based on profile data and current path
  const getCompletedStep = () => {
    if (!profile || location.pathname === '/signup') return 0;
    
    if (profile.payment_status === 'paid') return 3;
    if (profile.full_name && profile.gender && profile.age) return 2;
    if (profile.phone) return 1;
    return 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div className="container max-w-4xl mx-auto p-4 flex justify-between items-center">
          <BackButton />
          <WhatsAppSupport />
          <LanguageSelector />
        </div>
        <div className="container max-w-4xl mx-auto px-4 pb-6">
          <ProgressSteps 
            steps={steps} 
            currentStep={Math.max(currentStep, getCompletedStep())} 
          />
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto p-4">
        <div className="flex-1">
          <Outlet />
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground bg-white dark:bg-gray-900">
        {language === 'ar' ? '© 2025 جميع الحقوق محفوظة' : '© 2025 All rights reserved'}
      </footer>
    </div>
  );
};