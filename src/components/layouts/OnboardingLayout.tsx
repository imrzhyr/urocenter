import { ProgressSteps } from "@/components/ProgressSteps";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";

const steps = ["Sign Up", "Profile", "Medical Info", "Payment"];

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
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div className="container max-w-4xl mx-auto p-4 flex justify-between items-center">
          <BackButton />
          <LanguageSelector />
        </div>
        <div className="container max-w-4xl mx-auto px-4 pb-6">
          <ProgressSteps steps={steps} currentStep={currentStep} />
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
