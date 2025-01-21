import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfile } from "./useProfile";
import { useLanguage } from "@/contexts/LanguageContext";

export const useOnboarding = () => {
  const navigate = useNavigate();
  const { profile, isLoading, refetch } = useProfile();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error(t("please_sign_in_first"));
        navigate("/signin");
        return false;
      }

      if (!profile) {
        return false;
      }

      const currentPath = window.location.pathname;

      // Define the onboarding steps and their validation rules
      const steps = [
        {
          path: "/signup",
          isComplete: () => Boolean(profile.phone),
          redirectTo: "/signup",
          message: t("complete_signup_first")
        },
        {
          path: "/profile",
          isComplete: () => Boolean(profile.phone),
          redirectTo: "/signup",
          message: t("complete_signup_first")
        },
        {
          path: "/medical-information",
          isComplete: () => Boolean(profile.full_name && profile.gender && profile.age),
          redirectTo: "/profile",
          message: t("complete_profile_first")
        },
        {
          path: "/payment",
          isComplete: () => {
            // Only allow access to payment if medical info is complete
            const isMedicalComplete = Boolean(profile.full_name && profile.gender && profile.age);
            if (!isMedicalComplete) {
              return false;
            }
            // If already paid, allow access
            if (profile.payment_status === 'paid') {
              return true;
            }
            return true; // Allow access to payment page if medical info is complete
          },
          redirectTo: "/medical-information",
          message: t("complete_medical_info_first")
        },
        {
          path: "/dashboard",
          isComplete: () => {
            const isProfileComplete = Boolean(profile.full_name && profile.gender && profile.age);
            const isPaid = profile.payment_status === 'paid';
            return isProfileComplete && isPaid;
          },
          redirectTo: "/payment",
          message: t("complete_payment_first")
        }
      ];

      // Find current step
      const currentStepIndex = steps.findIndex(step => step.path === currentPath);
      
      // If we're not on an onboarding page, check if we should be
      if (currentStepIndex === -1) {
        // If on dashboard but not completed all steps
        if (currentPath === '/dashboard' && !steps[4].isComplete()) {
          // Find the first incomplete step
          const incompleteStep = steps.find(step => !step.isComplete());
          if (incompleteStep) {
            navigate(incompleteStep.redirectTo);
            return false;
          }
        }
        return true;
      }

      // Check if previous steps are complete
      for (let i = 0; i < currentStepIndex; i++) {
        if (!steps[i].isComplete()) {
          toast.error(steps[currentStepIndex].message);
          navigate(steps[i].redirectTo);
          return false;
        }
      }

      // If all steps are complete and we're not on dashboard, go to dashboard
      if (currentPath !== '/dashboard' && steps[4].isComplete()) {
        navigate("/dashboard");
        return true;
      }

      return true;
    };

    if (!isLoading) {
      checkAuth();
    }
  }, [navigate, isLoading, profile, t]);

  return {
    profile,
    isLoading,
    refetch
  };
};