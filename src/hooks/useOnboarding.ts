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
          isComplete: () => true, // Always allow signup
        },
        {
          path: "/profile",
          isComplete: () => Boolean(profile.full_name && profile.gender && profile.age),
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
          isComplete: () => Boolean(profile.full_name && profile.gender && profile.age),
          redirectTo: "/medical-information",
          message: t("complete_medical_info_first")
        }
      ];

      // Find current step
      const currentStepIndex = steps.findIndex(step => step.path === currentPath);
      
      // If we're not on an onboarding page, don't interfere
      if (currentStepIndex === -1) return true;

      // Check if previous steps are complete
      for (let i = 0; i < currentStepIndex; i++) {
        if (!steps[i].isComplete()) {
          toast.error(steps[currentStepIndex].message);
          navigate(steps[i].redirectTo);
          return false;
        }
      }

      // Special case for payment page
      if (currentPath !== '/payment' && profile.payment_status === 'paid') {
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